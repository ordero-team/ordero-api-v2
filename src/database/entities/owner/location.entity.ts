import { BaseEntity } from '@db/entities/base/base';
import { BooleanColumn, CoreEntity, ForeignColumn, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { Brackets, JoinColumn, ManyToOne, OneToMany, SelectQueryBuilder } from 'typeorm';
import { Order } from '../core/order.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { ProductStock } from './product-stock.entity';
import { Table } from './table.entity';

@CoreEntity()
export class Location extends BaseEntity {
  public static sortable = ['name'];
  public static searchable = ['search'];

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

  static onFilterSearch(value: string, builder: SelectQueryBuilder<Location>) {
    builder.nextWhere(
      new Brackets((qb) => {
        qb.where('t1.name LIKE :query', { query: `%${value}%` });
      })
    );
  }
}
