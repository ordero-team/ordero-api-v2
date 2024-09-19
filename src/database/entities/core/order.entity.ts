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
import { Brackets, Column, Generated, Index, JoinColumn, ManyToOne, OneToMany, SelectQueryBuilder } from 'typeorm';
import { Location } from '../owner/location.entity';
import { Owner } from '../owner/owner.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { Table } from '../owner/table.entity';
import { StaffUser } from '../staff/user.entity';
import { Customer } from './customer.entity';
import { OrderProduct } from './order-product.entity';

export enum OrderStatus {
  WaitingApproval = 'waiting_approval',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  Served = 'served',
  WaitingPayment = 'waiting_payment',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@CoreEntity({ autoIncrement: 202410000001 })
export class Order extends BaseEntity {
  public static sortable = ['number', 'status', 'created_at'];
  public static searchable = ['search', 'status'];

  @Exclude()
  @Generated('increment')
  @NotNullColumn({ type: 'bigint', unique: true })
  uid: number;

  @Index()
  @Column({ length: 50 })
  number: string;

  @PriceColumn()
  gross_total: number;

  @PriceColumn()
  discount: number;

  @PriceColumn()
  net_total: number;

  @DateTimeColumn()
  billed_at: Date;

  @StatusColumn()
  status: OrderStatus;

  @Column({ nullable: true })
  note: string;

  @Column()
  customer_name: string;

  @Column({ nullable: true })
  customer_phone: string;

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
  @ForeignColumn()
  staff_id: string;

  @JoinColumn()
  @ManyToOne(() => StaffUser, (user) => user.orders, { onDelete: 'SET NULL' })
  staff: Promise<StaffUser>;

  @Exclude()
  @ForeignColumn()
  owner_id: string;

  @JoinColumn()
  @ManyToOne(() => Owner, (user) => user.orders, { onDelete: 'SET NULL' })
  owner: Promise<Owner>;

  @Exclude()
  @OneToMany(() => OrderProduct, (op) => op.order)
  order_products: Promise<OrderProduct[]>;

  static onFilterSearch(value: string, builder: SelectQueryBuilder<Order>) {
    builder.nextWhere(
      new Brackets((qb) => {
        qb.where('t1.number LIKE :query', { query: `%${value}%` });
      })
    );
  }

  static onFilterStatus(value: any, builder: SelectQueryBuilder<Order>) {
    const states = (value || '').split(',').filter((row) => Object.values(OrderStatus).includes(row));
    if (states.length > 0) {
      builder.nextWhere('t1.status IN (:status)', { status: states });
    }
  }

  get customerLogName(): string {
    return `${this.customer_name}${this.customer_phone ? ' (' + this.customer_phone + ')' : ''}`;
  }
}
