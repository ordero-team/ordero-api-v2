import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Location } from './location.entity';
import { ProductVariant } from './product-variant.entity';
import { Product } from './product.entity';
import { Restaurant } from './restaurant.entity';

@CoreEntity()
export class ProductStock extends BaseEntity {
  @Column({ type: 'integer', default: 0 })
  onhand: number;

  @Column({ type: 'integer', default: 0 })
  allocated: number;

  @Column({ type: 'integer', default: 0 })
  available: number;

  @Column({ type: 'integer', default: 0 })
  threshold: number;

  @Column({ type: 'integer', default: 0 })
  sold: number;

  @Column()
  last_action: string;

  @Column({ length: 100, nullable: true })
  actor: string;

  @Exclude()
  @ForeignColumn()
  variant_id: string;

  @JoinColumn()
  @ManyToOne(() => ProductVariant, (variant) => variant.stocks)
  variant: Promise<ProductVariant>;

  @Exclude()
  @ForeignColumn()
  product_id: string;

  @JoinColumn()
  @ManyToOne(() => Product, (variant) => variant.stocks)
  product: Promise<Product>;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @JoinColumn()
  @ManyToOne(() => Location, (loca) => loca.stocks)
  location: Promise<Location>;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (resta) => resta.stocks)
  restaurant: Promise<Restaurant>;
}
