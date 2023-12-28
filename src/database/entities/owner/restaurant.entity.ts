import { BaseEntity } from '@db/entities/base/base';
import { Media } from '@db/entities/core/media.entity';
import { CoreEntity, ForeignColumn, NotNullColumn, PhoneColumn, StatusColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../core/order.entity';
import { Employee } from './employee.entity';
import { Location } from './location.entity';
import { ProductStock } from './product-stock.entity';
import { Table } from './table.entity';

export enum RestaurantStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@CoreEntity()
export class Restaurant extends BaseEntity {
  @NotNullColumn()
  name: string;

  @PhoneColumn()
  phone: string;

  @StatusColumn()
  status: RestaurantStatus;

  @Exclude()
  @ForeignColumn()
  owner_id: string;

  @JoinColumn()
  @OneToOne(() => Employee, { onDelete: 'RESTRICT' })
  owner: Employee;

  @Exclude()
  @OneToMany(() => Media, (media) => media.restaurant)
  images: Promise<Media[]>;

  @Exclude()
  @OneToMany(() => Location, (location) => location.restaurant)
  locations: Promise<Location[]>;

  @Exclude()
  @OneToMany(() => Table, (table) => table.restaurant)
  tables: Promise<Table[]>;

  @Exclude()
  @OneToMany(() => ProductStock, (stock) => stock.restaurant)
  stocks: Promise<ProductStock[]>;

  @Exclude()
  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Promise<Order[]>;
}
