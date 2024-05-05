import { BaseEntity } from '@db/entities/base/base';
import {
  CoreEntity,
  DateTimeColumn,
  ForeignColumn,
  NotNullColumn,
  PriceColumn,
  StatusColumn,
} from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { Column, Generated, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Location } from '../owner/location.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { Table } from '../owner/table.entity';
import { Customer } from './customer.entity';
import { OrderProduct } from './order-product.entity';

export enum OrderStatus {
  WaitingApproval = 'waiting_approval',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  Served = 'served',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@CoreEntity({ autoIncrement: 202410000001 })
export class Order extends BaseEntity {
  @Exclude()
  @Generated('increment')
  @NotNullColumn({ type: 'bigint', unique: true })
  uid: number;

  @Column({ length: 50 })
  number: string;

  @PriceColumn()
  gross_total: string;

  @PriceColumn()
  discount: string;

  @PriceColumn()
  net_total: string;

  @DateTimeColumn()
  billed_at: Date;

  @StatusColumn()
  status: OrderStatus;

  @Column({ nullable: true })
  note: string;

  @Exclude()
  @ForeignColumn()
  customer_id: string;

  @JoinColumn()
  @ManyToOne(() => Customer, (cust) => cust.orders, { onDelete: 'CASCADE', nullable: true })
  customer: Promise<Customer>;

  @Exclude()
  @ForeignColumn()
  table_id: string;

  @JoinColumn()
  @ManyToOne(() => Table, (tabl) => tabl.orders, { onDelete: 'CASCADE' })
  table: Promise<Table>;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, { onDelete: 'CASCADE' })
  restaurant: Promise<Restaurant>;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @JoinColumn()
  @ManyToOne(() => Location, (loc) => loc.orders, { onDelete: 'CASCADE' })
  location: Promise<Location>;

  @Exclude()
  @OneToMany(() => OrderProduct, (op) => op.order)
  order_products: Promise<OrderProduct[]>;
}
