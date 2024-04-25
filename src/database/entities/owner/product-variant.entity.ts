import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, ForeignColumn, NotNullColumn, PriceColumn } from '@lib/typeorm/decorators';
import { VariantStatus } from 'aws-sdk/clients/sagemaker';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderProduct } from '../core/order-product.entity';
import { ProductStock } from './product-stock.entity';
import { Product } from './product.entity';
import { Restaurant } from './restaurant.entity';
import { Variant } from './variant.entity';

@CoreEntity()
export class ProductVariant extends BaseEntity {
  @NotNullColumn()
  status: VariantStatus;

  @PriceColumn()
  price: number;

  @Exclude()
  @ForeignColumn()
  product_id: string;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.variants)
  product: Promise<Product>;

  @ForeignColumn()
  variant_id: string;

  @JoinColumn()
  @ManyToOne(() => Variant, (variant) => variant.products, { nullable: true })
  variant: Promise<Variant>;

  @Exclude()
  @OneToMany(() => ProductStock, (stock) => stock.variant)
  stocks: Promise<ProductStock[]>;

  @Exclude()
  @OneToMany(() => OrderProduct, (op) => op.product_variant)
  order_products: Promise<OrderProduct[]>;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.product_variants, { onDelete: 'CASCADE' })
  restaurant: Promise<Restaurant>;
}
