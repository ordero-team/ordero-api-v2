import { Me } from '@core/decorators/user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';
import { PdfService } from '@core/services/pdf.service';
import { Customer } from '@db/entities/core/customer.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { GenericException } from '@lib/exceptions/generic.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { config } from '@lib/helpers/config.helper';
import { time } from '@lib/helpers/time.helper';
import { writeFile } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import Logger from '@lib/logger/logger.library';
import Socket, { PubSubEventType, PubSubPayloadType, PubSubStatus } from '@lib/pubsub/pubsub.lib';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { BadRequestException, Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';

@Controller(':order_id')
export class DetailController {
  constructor(private pdf: PdfService) {}

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

  @Get('/print')
  async generateBill(@Param() param, @Res() response) {
    const request_id = uuid();
    const processing = async (): Promise<string> => {
      const order = await Order.findOneByOrFail({ id: param.order_id });

      if (order.status !== OrderStatus.Completed) {
        throw new GenericException(`Only completed order can be printed`);
      }

      const restaurant = await order.restaurant;
      const location = await order.location;
      const staff = await order.staff;
      const owner = await order.owner;

      const products: { name: string; qty: string; price: string; total: string }[] = [];
      const items = await order.order_products;
      for (const item of items) {
        const productVar = await item.product_variant;
        const product = await productVar.product;
        products.push({
          name: product.name.length > 20 ? product.name.substring(0, 17) + '...' : product.name,
          qty: item.qty.toString(),
          price: item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
          total: (item.price * item.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
        });
      }

      const payload = {
        restaurantName: restaurant.name,
        restaurantAddress: location.address || '-',
        restaurantPhone: restaurant.phone || '-',
        receiptNumber: order.number,
        billedAt: time(order.billed_at).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
        cashierName: (owner || staff).logName,
        items: products,
        total: order.net_total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
      };

      const pdf = await this.pdf.billInvoice(payload);
      const dir = `${config.getPublicPath()}/files`;
      const filename = `${time().unix()}-order-bill.pdf`;
      return writeFile(dir, filename, pdf);
    };

    processing()
      .then((path) => {
        // send event
        Socket.getInstance().event(param.order_id, {
          request_id,
          status: PubSubStatus.Success,
          type: PubSubEventType.CustomerGetBill,
          payload: {
            type: PubSubPayloadType.Download,
            body: {
              mime: 'text/href',
              name: `${time().unix()}-order-bill.pdf`,
              content: config.getDownloadURI(path),
            },
          },
        });
      })
      .catch(async (error) => {
        // send event
        Socket.getInstance().event(param.order_id, {
          request_id,
          status: PubSubStatus.Fail,
          type: PubSubEventType.StaffGetBill,
          error: error.message,
        });

        Logger.getInstance().notify(error);
      });

    return response.data({ request_id });
  }
}
