import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';

@CoreEntity()
export class Category extends BaseEntity {
  @NotNullColumn()
  name: string;

  @Exclude()
  @OneToMany(() => ProductCategory, (productCat) => productCat.category)
  products: Promise<ProductCategory[]>;
}
