import { Rest } from '@core/decorators/restaurant.decorator';
import { Me } from '@core/decorators/user.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PermAct, PermStaff } from '@core/services/role.service';
import { Notification, NotificationType } from '@db/entities/core/notification.entity';
import { OrderProduct, OrderProductStatus } from '@db/entities/core/order-product.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { StaffUser } from '@db/entities/staff/user.entity';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { GenericException } from '@lib/exceptions/generic.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { time } from '@lib/helpers/time.helper';
import { titleCase } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import Socket from '@lib/pubsub/pubsub.lib';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

@Controller(':order_id')
@UseGuards(StaffAuthGuard())
export class DetailController {
  static async action(order: Order, action: OrderStatus, actor: StaffUser) {
    try {
      // @TODO: How "REJECTED" flow works
      const stocks: ProductStock[] = [];
      switch (action) {
        case OrderStatus.Confirmed: {
          if (order.status !== OrderStatus.WaitingApproval) {
            throw new GenericException(`Order ${order.number} can't be confirmed.`);
          }

          order.status = action;
          break;
        }
        case OrderStatus.Preparing: {
          if (order.status !== OrderStatus.Confirmed) {
            throw new GenericException(`Order ${order.number} can't be set to Preparing.`);
          }
          order.status = action;
          break;
        }
        case OrderStatus.Served: {
          if (order.status !== OrderStatus.Preparing) {
            throw new GenericException(`Order ${order.number} can't be set to Served.`);
          }
          order.status = action;
          break;
        }
        case OrderStatus.WaitingPayment: {
          if (order.status !== OrderStatus.Served) {
            throw new GenericException(`Order ${order.number} can't be set to Waiting Payment.`);
          }
          order.status = action;
          break;
        }
        case OrderStatus.Completed: {
          if (order.status !== OrderStatus.WaitingPayment) {
            throw new GenericException(`Order ${order.number} can't be set to Completed.`);
          }
          order.status = action;
          order.billed_at = time().toDate();

          const orderProducts = await OrderProduct.findBy({ order_id: order.id });
          const productStocks = await ProductStock.findBy({
            variant_id: In(orderProducts.map((val) => val.product_variant_id)),
            location_id: order.location_id,
          });

          for (const stock of productStocks) {
            const orderProduct = orderProducts.find((val) => val.product_variant_id === stock.variant_id);
            if (orderProduct) {
              stock.onhand -= stock.allocated; // Decrease Onhand Stock
              stock.allocated -= orderProduct.qty; // Decrease Allocated Stock
              stock.actor = actor ? actor.logName : 'System';
              stock.last_action = `Completed Order: ${order.number}`;
              stocks.push(stock);
            }
          }

          break;
        }
        case OrderStatus.Cancelled: {
          if (order.status !== OrderStatus.WaitingApproval) {
            throw new GenericException(`Order ${order.number} can't be cancelled.`);
          }
          // @TODO: Able to cancel/decline Product and Recalculate Gross Total

          order.status = action;

          const orderProducts = await OrderProduct.findBy({ order_id: order.id });
          const productStocks = await ProductStock.findBy({
            variant_id: In(orderProducts.map((val) => val.product_variant_id)),
            location_id: order.location_id,
          });

          for (const stock of productStocks) {
            const orderProduct = orderProducts.find((val) => val.product_variant_id === stock.variant_id);
            if (orderProduct) {
              stock.allocated -= orderProduct.qty; // Decrease Allocated Stock
              stock.actor = actor ? actor.logName : 'System';
              stocks.push(stock);
            }
          }

          break;
        }
      }

      const notification = new Notification();
      notification.title = 'Order Updated';
      notification.content = JSON.stringify(order);
      notification.actor = 'System';
      notification.location_id = order.location_id;
      notification.restaurant_id = order.restaurant_id;
      notification.type = NotificationType.OrderUpdate;
      notification.order_id = order.id;

      await AppDataSource.transaction(async (manager) => {
        await manager.getRepository(Order).save(order);

        const orderProductStatus = {
          [OrderStatus.Cancelled]: OrderProductStatus.Cancelled,
          [OrderStatus.Completed]: OrderProductStatus.Served,
          [OrderStatus.Preparing]: OrderProductStatus.Preparing,
        };

        if (order.status in orderProductStatus) {
          await manager
            .getRepository(OrderProduct)
            .update({ order_id: order.id }, { status: orderProductStatus[order.status] });
        }

        if ([OrderStatus.Completed, OrderStatus.Cancelled].includes(order.status)) {
          const table = await manager.getRepository(Table).findOneBy({ id: order.table_id });
          if (!table) {
            throw new Error(`Table not found with ID: ${order.table_id}`);
          }

          if (table.status !== TableStatus.InUse) {
            throw new Error(`Table ${table.number} is not In Use`);
          }

          table.status = TableStatus.Available;
          await manager.getRepository(Table).save(table);
        }

        // Update Stock
        for (const stock of stocks) {
          stock.last_action = `${titleCase(order.status)} Order: ${order.number}`;
          await manager.getRepository(ProductStock).save(stock);
        }

        await manager.getRepository(Notification).save(notification);
      });

      Socket.getInstance().notify(notification.order_id, {
        request_id: uuid(),
        data: notification,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Order}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const order = await Order.findOneByOrFail({ restaurant_id: rest.id, id: param.order_id });
    await response.item(order, OrderTransformer);
  }

  @Put()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Order}@${PermAct.U}`)
  async action(@Body() body, @Param() param, @Res() response, @Me() me: StaffUser) {
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
    await DetailController.action(order, body.action, me);
    await order.reload();

    return response.item(order, OrderTransformer);
  }
}
