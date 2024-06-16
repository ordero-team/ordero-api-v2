import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { OrderProduct, OrderProductStatus } from '@db/entities/core/order-product.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { GenericException } from '@lib/exceptions/generic.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { time } from '@lib/helpers/time.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';

@Controller(':order_id')
@UseGuards(OwnerAuthGuard())
export class DetailController {
  static async action(order: Order, action: OrderStatus) {
    try {
      switch (order.status) {
        case OrderStatus.WaitingApproval: {
          // @TODO: How "REJECTED" flow works?
          if (![OrderStatus.Confirmed, OrderStatus.Cancelled].includes(action)) {
            throw new GenericException(`Order ${order.number} must be confirmed first.`);
          }

          order.status = action;
          break;
        }
        case OrderStatus.Confirmed: {
          if (![OrderStatus.Preparing].includes(action)) {
            throw new GenericException(`Order ${order.number} can't be ${action}.`);
          }

          order.status = OrderStatus.Preparing;
          break;
        }
        case OrderStatus.Preparing: {
          if (![OrderStatus.Served].includes(action)) {
            throw new GenericException(`Order ${order.number} can't be ${action}.`);
          }

          order.status = OrderStatus.Served;
          break;
        }
        case OrderStatus.Served: {
          if (![OrderStatus.WaitingPayment].includes(action)) {
            throw new GenericException(`Order ${order.number} can't be ${action}.`);
          }

          order.status = OrderStatus.WaitingPayment;
          break;
        }
        case OrderStatus.WaitingPayment: {
          if (![OrderStatus.Completed].includes(action)) {
            throw new GenericException(`Order ${order.number} can't be ${action}.`);
          }

          order.status = OrderStatus.Completed;
          order.billed_at = time().toDate();
          break;
        }
        case OrderStatus.Completed:
        case OrderStatus.Cancelled:
          break;
      }

      await AppDataSource.transaction(async (manager) => {
        await manager.getRepository(Order).save(order);

        if (order.status === OrderStatus.Preparing) {
          await manager.getRepository(OrderProduct).update({ order_id: order.id }, { status: OrderProductStatus.Preparing });
        } else if ([OrderStatus.Completed, OrderStatus.Cancelled].includes(order.status)) {
          const table = await manager.getRepository(Table).findOneBy({ id: order.table_id });
          table.status = TableStatus.Available;
          await manager.getRepository(Table).save(table);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Order}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const order = await Order.findOneByOrFail({ restaurant_id: rest.id, id: param.order_id });
    await response.item(order, OrderTransformer);
  }

  @Put()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Order}@${PermAct.U}`)
  async action(@Body() body, @Param() param, @Res() response) {
    const rules = {
      action: `required|in:${Object.values(OrderStatus)
        .filter((val) => val !== 'waiting_approval')
        .join(',')}`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const order = await Order.findOneByOrFail({ id: param.order_id });
    await DetailController.action(order, body.action);
    await order.reload();

    return response.item(order, OrderTransformer);
  }
}
