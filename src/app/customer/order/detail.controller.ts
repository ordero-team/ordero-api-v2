import { Order } from '@db/entities/core/order.entity';
import { OrderTransformer } from '@db/transformers/order.tranformer';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller(':order_id')
export class DetailController {
  @Get()
  async show(@Res() response, @Param() param) {
    const order = await Order.findOneByOrFail({ id: param.order_id });
    await response.item(order, OrderTransformer);
  }
}
