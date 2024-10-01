import { Me } from '@core/decorators/user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';
import { CustomerService } from '@core/services/customer.service';
import { Customer, CustomerStatus } from '@db/entities/core/customer.entity';
import { Notification, NotificationType } from '@db/entities/core/notification.entity';
import { OrderProduct, OrderProductStatus } from '@db/entities/core/order-product.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { Variant, VariantStatus } from '@db/entities/owner/variant.entity';
import { IOrderDetail } from '@db/interfaces/order.interface';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { sequenceNumber } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import Socket from '@lib/pubsub/pubsub.lib';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { get } from 'lodash';
import { IsNull } from 'typeorm';

@Controller()
export class OrderController {
  constructor(private custService: CustomerService) {}

  static async createOrder(newOrder: IOrderDetail, customer: Customer): Promise<Order> {
    try {
      const order = new Order();
      await AppDataSource.transaction(async (manager) => {
        const table = await manager.getRepository(Table).findOneBy({ id: order.table_id, status: TableStatus.Available });

        if (!table) {
          throw new BadRequestException('Sorry, this table is not available right now');
        }

        const orderProducts = newOrder.products || [];
        if (!orderProducts.length) {
          throw new BadRequestException(`Order has no product items`);
        }

        if (orderProducts.some((row) => row.qty < 1)) {
          throw new BadRequestException(`Order has invalid product item qty of 0`);
        }

        order.restaurant_id = newOrder.restaurant_id;
        order.location_id = table.location_id;
        order.table_id = newOrder.table_id;
        order.status = newOrder.status;
        order.note = newOrder.note;
        order.customer_id = customer?.id || null;
        order.discount = null;
        order.customer_name = newOrder.customer_name;
        order.customer_phone = newOrder.customer_phone;
        order.number = ''; // Will be update it later

        await manager.getRepository(Order).save(order);

        const orderedProducts: OrderProduct[] = [];
        const productStocks: ProductStock[] = [];
        for (const product of newOrder.products) {
          const variant = await manager.getRepository(ProductVariant).findOneOrFail({
            where: {
              product_id: product.id,
              variant_id: get(product, 'variant_id', null) || IsNull(),
              restaurant_id: newOrder.restaurant_id,
              status: VariantStatus.Available,
            },
          });

          const stock = await manager.getRepository(ProductStock).findOneOrFail({
            where: {
              restaurant_id: order.restaurant_id,
              location_id: order.location_id,
              variant_id: variant.id,
            },
          });

          if (product.qty > stock.available) {
            const product = await manager.getRepository(Product).findOneByOrFail({ id: variant.product_id });

            let productName = product.name;

            if (variant.variant_id) {
              const vari = await manager.getRepository(Variant).findOneByOrFail({ id: variant.variant_id });

              productName += ` - ${vari.name}`;
            }

            throw new BadRequestException(`Sorry, ${productName} stock is insufficient`);
          }

          let orderProduct = new OrderProduct();

          const checkOrderProduct = await manager.getRepository(OrderProduct).findOneBy({
            order_id: order.id,
            product_variant_id: variant.id,
          });
          if (checkOrderProduct) {
            orderProduct = checkOrderProduct;
          }

          stock.allocated += product.qty;
          stock.actor = order.customerLogName ?? 'System';
          productStocks.push(stock);

          orderProduct.order_id = order.id;
          orderProduct.product_variant_id = variant.id;
          orderProduct.qty = product.qty;
          orderProduct.price = variant.price;
          orderProduct.status = OrderProductStatus.WaitingApproval;
          await manager.getRepository(OrderProduct).save(orderProduct);

          orderedProducts.push(orderProduct);
        }

        // Updare Order Number
        const orderNumber = sequenceNumber(order.uid);
        const totalPrice = orderedProducts.reduce((price, a) => price + a.price, 0);
        await manager.getRepository(Order).update(order.id, {
          number: orderNumber,
          gross_total: totalPrice,
          net_total: totalPrice,
        });

        table.status = TableStatus.InUse;
        await manager.getRepository(Table).save(table);

        for (const stock of productStocks) {
          stock.last_action = `Incoming Order: ${orderNumber}`;
          stock.actor = order.customerLogName;
          await manager.getRepository(ProductStock).save(stock);
        }
      });

      await order.reload();

      return order;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createOrder(@Res() response, @Body() body) {
    const rules = {
      restaurant_id: 'required|uid',
      table_id: 'required|uid',
      customer_name: 'required|safe_text',
      customer_phone: 'phone',
      products: 'required|array',
      note: 'safe_text',
    };

    try {
      const validation = Validator.init(body, rules);
      if (validation.fails()) {
        throw new ValidationException(validation);
      }

      const newOrder: IOrderDetail = {
        restaurant_id: get(body, 'restaurant_id', null),
        table_id: get(body, 'table_id', null),
        status: OrderStatus.WaitingApproval,
        customer_name: get(body, 'customer_name', 'Guest'),
        customer_phone: get(body, 'customer_phone', null),
        note: get(body, 'note', null),
        gross_total: 0,
        discount: 0,
        fee: 0,
        net_total: 0,
        products: get(body, 'products', []),
      };

      // @TODO: Manage new or existing customer
      let customer: Customer = null;
      if (body.customer_phone) {
        customer = await Customer.findOneBy({ phone: body.customer_phone });

        if (!customer) {
          // @TODO: Create new customer and also verify it!
          customer.name = newOrder.customer_name;
          customer.phone = newOrder.customer_phone;
          const newCustomer = await this.custService.register(customer);
          const token = await this.custService.login(newCustomer);
          return response.data(token);
        }

        if (customer.status === CustomerStatus.Verify) {
          const token = await this.custService.login(customer);
          return response.data(token);
        }
      }

      const order = await OrderController.createOrder(newOrder, customer);

      const notification = new Notification();
      notification.title = 'New Order';
      notification.content = `Order ${order.number} has been created`;
      notification.actor = customer ? customer.name : newOrder.customer_name;
      notification.location_id = order.location_id;
      notification.restaurant_id = order.restaurant_id;
      notification.type = NotificationType.OrderCreated;
      notification.order_id = order.id;

      await AppDataSource.transaction(async (manager) => {
        await manager.getRepository(Notification).save(notification);
      });

      Socket.getInstance().notify(notification.location_id, {
        request_id: uuid(),
        data: notification,
      });

      return response.item(order, OrderTransformer);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async index(@Res() response, @Me() me: Customer) {
    const orders = await AppDataSource.createQueryBuilder(Order, 't1')
      .where({ customer_id: me.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(orders, OrderTransformer);
  }
}
