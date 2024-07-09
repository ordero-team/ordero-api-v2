import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Table } from '@db/entities/owner/table.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { In, Not } from 'typeorm';
import { LocationTransformer } from './location.transformer';
import { OrderTransformer } from './order.transformer';
import { RestaurantTransformer } from './restaurant.transformer';

export class TableTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['restaurant', 'location', 'order'];
  }

  async includeRestaurant(entity: Table) {
    const restaurant = await entity.restaurant;
    if (!restaurant) {
      return this.null();
    }

    return this.item(restaurant, RestaurantTransformer);
  }

  async includeLocation(entity: Table) {
    const location = await entity.location;
    if (!location) {
      return this.null();
    }

    return this.item(location, LocationTransformer);
  }

  async includeOrder(entity: Table) {
    const order = await Order.findOneBy({
      table_id: entity.id,
      status: Not(In([OrderStatus.Completed, OrderStatus.Cancelled])),
    });

    if (!order) {
      return this.null();
    }

    return this.item(order, OrderTransformer);
  }

  transform(entity: Table) {
    return entity.toJSON();
  }
}
