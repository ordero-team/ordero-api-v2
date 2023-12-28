import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, NotNullColumn, PriceColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';

@CoreEntity()
export class Variant extends BaseEntity {
  @NotNullColumn()
  name: string;

  @PriceColumn()
  price: number;

  @Exclude()
  @OneToMany(() => ProductCategory, (productCat) => productCat.category)
  products: Promise<ProductCategory[]>;
}
