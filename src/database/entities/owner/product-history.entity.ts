import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, CreateDateColumn, ForeignColumn, JsonColumn, UpdateDateColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { Brackets, ManyToOne, SelectQueryBuilder } from 'typeorm';
import { Location } from './location.entity';
import { Product } from './product.entity';

@CoreEntity()
export class ProductHistory extends BaseEntity {
  public static sortable = [];
  public static defaultSort = [];
  public static searchable = ['search'];

  @Column()
  action: string;

  @JsonColumn()
  data: any;

  @Column()
  actor: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @ForeignColumn()
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  location: Location;

  static onFilterSearch(value: string, builder: SelectQueryBuilder<ProductHistory>) {
    builder.nextWhere(
      new Brackets((qb) => {
        qb.where('action LIKE :query', { query: `%${value}%` });
      })
    );
  }
}
