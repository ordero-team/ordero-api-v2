import { BaseEntity } from '@db/entities/base/base';
import { BooleanColumn, CoreEntity, ForeignColumn, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Order } from '../core/order.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { ProductStock } from './product-stock.entity';
import { Table } from './table.entity';

@CoreEntity()
export class Location extends BaseEntity {
  @NotNullColumn()
  name: string;

  @BooleanColumn()
  is_default: boolean;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.locations, { onDelete: 'CASCADE' })
  restaurant: Promise<Restaurant>;

  @Exclude()
  @OneToMany(() => Table, (table) => table.location)
  tables: Promise<Table[]>;

  @Exclude()
  @OneToMany(() => ProductStock, (stock) => stock.location)
  stocks: Promise<ProductStock[]>;

  @Exclude()
  @OneToMany(() => Order, (order) => order.location)
  orders: Promise<Order[]>;
}
