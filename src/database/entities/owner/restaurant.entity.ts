import { BaseEntity } from '@db/entities/base/base';
import { Media } from '@db/entities/core/media.entity';
import { CoreEntity, EmailColumn, ForeignColumn, NotNullColumn, PhoneColumn, StatusColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../core/order.entity';
import { Category } from './category.entity';
import { Location } from './location.entity';
import { Owner } from './owner.entity';
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

  @Column()
  slug: string;

  @EmailColumn()
  email: string;

  @Column({ nullable: true })
  website: string;

  @StatusColumn()
  status: RestaurantStatus;

  @Exclude()
  @ForeignColumn()
  owner_id: string;

  @JoinColumn()
  @OneToOne(() => Owner, { onDelete: 'RESTRICT' })
  owner: Owner;

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

  @Exclude()
  @OneToMany(() => Category, (cate) => cate.restaurant)
  categories: Promise<Category[]>;
}
