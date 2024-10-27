import { Notification, NotificationType } from '@db/entities/core/notification.entity';
import { OrderProduct, OrderProductStatus } from '@db/entities/core/order-product.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { StaffUser } from '@db/entities/staff/user.entity';
import { GenericException } from '@lib/exceptions/generic.exception';
import Socket from '@lib/pubsub/pubsub.lib';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { has } from 'lodash';
import { In } from 'typeorm';
import { time } from './time.helper';
import { titleCase } from './utils.helper';

export class OrderHelper {
  static async processOrder(
    order: Order,
    action: OrderStatus,
    actor: Owner | StaffUser,
    body?: { pay_amount: number } | null
  ): Promise<Order> {
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

          if (body && !has(body, 'pay_amount')) {
            throw new GenericException('Required pay amount');
          }

          const payAmount = Number(body.pay_amount);

          if (payAmount < order.gross_total) {
            throw new GenericException(`Pay amount can't be less then Order total price`);
          }

          if (payAmount >= order.gross_total) {
            order.pay_amount = payAmount;
            order.change_amount = Math.max(0, payAmount - order.gross_total);
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
              stock.sold += orderProduct.qty;
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
        if (!order.staff_id && !order.owner_id) {
          if (actor instanceof Owner) {
            order.owner_id = actor.id;
          } else if (actor instanceof StaffUser) {
            order.staff_id = actor.id;
          }
        }

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
          stock.actor = actor.logName;
          await manager.getRepository(ProductStock).save(stock);
        }

        await manager.getRepository(Notification).save(notification);
      });

      Socket.getInstance().notify(notification.order_id, {
        request_id: uuid(),
        data: notification,
      });

      return order;
    } catch (error) {
      throw error;
    }
  }
}
