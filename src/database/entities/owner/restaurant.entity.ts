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
import { ProductVariant } from './product-variant.entity';
import { Product } from './product.entity';
import { Table } from './table.entity';
import { Variant } from './variant.entity';

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

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column()
  slug: string;

  @EmailColumn()
  email: string;

  @Column({ nullable: true })
  website: string;

  @StatusColumn()
  status: RestaurantStatus;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  banner_url: string;

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

  @Exclude()
  @OneToMany(() => Variant, (variant) => variant.restaurant)
  variants: Promise<Variant[]>;

  @Exclude()
  @OneToMany(() => Product, (product) => product.restaurant)
  products: Promise<Product[]>;

  @Exclude()
  @OneToMany(() => ProductVariant, (prodVar) => prodVar.restaurant)
  product_variants: Promise<ProductVariant[]>;
}
