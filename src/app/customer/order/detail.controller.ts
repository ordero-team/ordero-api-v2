import { Me } from '@core/decorators/user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';
import { Customer } from '@db/entities/core/customer.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { OrderTransformer } from '@db/transformers/order.tranformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';

@Controller(':order_id')
export class DetailController {
  @Get()
  async show(@Res() response, @Param() param) {
    const order = await Order.findOneByOrFail({ id: param.order_id });
    await response.item(order, OrderTransformer);
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@Res() response, @Body() body, @Param() param, @Me() me: Customer) {
    const rules = {
      move_to: `required|in:cancelled`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const order = await Order.findOneByOrFail({ id: param.order_id, customer_id: me.id });

    if (order.status != OrderStatus.WaitingApproval) {
      throw new BadRequestException('Order is not cancellable');
    }

    order.status = OrderStatus.Cancelled;

    await AppDataSource.transaction(async (manager) => {
      await manager.getRepository(Order).save(order);
      await manager.getRepository(Table).update(order.table_id, { status: TableStatus.Available });
    });

    return response.item(order, OrderTransformer);
  }
}
