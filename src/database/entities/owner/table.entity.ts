import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, ForeignColumn, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Order } from '../core/order.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { Location } from './location.entity';

export enum TableStatus {
  Available = 'available',
  InUse = 'in_use',
  Reserved = 'reserved',
  Unvailable = 'unvailable',
  Empty = 'empty',
}

@CoreEntity()
export class Table extends BaseEntity {
  @NotNullColumn()
  number: string;

  @NotNullColumn()
  status: TableStatus;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @JoinColumn()
  @ManyToOne(() => Location, (location) => location.tables, { onDelete: 'CASCADE' })
  location: Promise<Location>;

  @Exclude()
  @OneToMany(() => Order, (order) => order.table)
  orders: Promise<Order[]>;
}
