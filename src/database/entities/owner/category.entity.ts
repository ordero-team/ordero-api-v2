import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, ForeignColumn, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { Restaurant } from './restaurant.entity';

@CoreEntity()
export class Category extends BaseEntity {
  @NotNullColumn()
  name: string;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant;

  @Exclude()
  @OneToMany(() => ProductCategory, (productCat) => productCat.category)
  products: Promise<ProductCategory[]>;
}
