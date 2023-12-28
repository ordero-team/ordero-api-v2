import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, NotNullColumn, PriceColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { Media } from '../core/media.entity';
import { ProductCategory } from './product-category.entity';
import { ProductVariant } from './product-variant.entity';

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
  name: string;

  @Column()
  description: string;

  @PriceColumn()
  price: number;

  @NotNullColumn()
  status: ProductStatus;

  @Exclude()
  @OneToMany(() => Media, (media) => media.product)
  images: Promise<Media[]>;

  @Exclude()
  @OneToMany(() => ProductCategory, (productCat) => productCat.product)
  categories: Promise<ProductCategory[]>;

  @Exclude()
  @OneToMany(() => ProductVariant, (productVar) => productVar.product)
  variants: Promise<ProductVariant[]>;
}
