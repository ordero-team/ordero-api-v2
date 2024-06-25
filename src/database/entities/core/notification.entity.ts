import { BooleanColumn, Column, CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base';
import { Location } from '../owner/location.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { Order } from './order.entity';

export enum NotificationType {
  OrderCreated = 'order_created',
  OrderUpdate = 'order_update',
}

@CoreEntity()
export class Notification extends BaseEntity {
  public static sortable = ['created_at'];

  @Column({ length: 100 })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 100 })
  actor: string;

  @BooleanColumn({ default: 0 })
  is_read: boolean;

  @ForeignColumn()
  location_id: string;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  location: Location;

  @ForeignColumn()
  restaurant_id: string;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @ForeignColumn()
  order_id: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order: Order;
}
