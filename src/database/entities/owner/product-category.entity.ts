import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity } from '@lib/typeorm/decorators';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';

@CoreEntity()
export class ProductCategory extends BaseEntity {
  @JoinColumn()
  @ManyToOne(() => Category, (catg) => catg.products)
  category: Category;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.categories)
  product: Product;
}
