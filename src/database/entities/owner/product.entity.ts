import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, ForeignColumn, NotNullColumn, PriceColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Media } from '../core/media.entity';
import { ProductCategory } from './product-category.entity';
import { ProductStock } from './product-stock.entity';
import { ProductVariant } from './product-variant.entity';
import { Restaurant } from './restaurant.entity';

export enum ProductStatus {
  Available = 'available',
  Unvailable = 'unavailable',
  SoldOut = 'sold_out',
  ComingSoon = 'coming_soon',
  Discontinued = 'discontinued',
}

@CoreEntity()
export class Product extends BaseEntity {
  @NotNullColumn()
  sku: string;

  @NotNullColumn()
  name: string;

  @Column()
  description: string;

  @PriceColumn()
  price: number;

  @NotNullColumn()
  status: ProductStatus;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (resta) => resta.products)
  restaurant: Promise<Restaurant>;

  @Exclude()
  @OneToMany(() => Media, (media) => media.product)
  images: Promise<Media[]>;

  @Exclude()
  @OneToMany(() => ProductCategory, (productCat) => productCat.product)
  categories: Promise<ProductCategory[]>;

  @Exclude()
  @OneToMany(() => ProductVariant, (productVar) => productVar.product)
  variants: Promise<ProductVariant[]>;

  @Exclude()
  @OneToMany(() => ProductStock, (stock) => stock.product)
  stocks: Promise<ProductStock[]>;
}
