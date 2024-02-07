import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';

@CoreEntity()
export class ProductCategory extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  category_id: string;

  @JoinColumn()
  @ManyToOne(() => Category, (catg) => catg.products)
  category: Category;

  @Exclude()
  @ForeignColumn()
  product_id: string;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.categories)
  product: Product;
}
