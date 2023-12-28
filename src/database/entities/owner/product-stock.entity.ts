import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity } from '@lib/typeorm/decorators';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Location } from './location.entity';
import { ProductVariant } from './product-variant.entity';
import { Restaurant } from './restaurant.entity';

@CoreEntity()
export class ProductStock extends BaseEntity {
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

  @JoinColumn()
  @ManyToOne(() => ProductVariant, (variant) => variant.stocks)
  variant: Promise<ProductVariant>;

  @JoinColumn()
  @ManyToOne(() => Location, (loca) => loca.stocks)
  location: Promise<Location>;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (resta) => resta.stocks)
  restaurant: Promise<Restaurant>;
}
