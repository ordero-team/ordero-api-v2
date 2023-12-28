import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderProduct } from '../core/order-product.entity';
import { ProductStock } from './product-stock.entity';
import { Product } from './product.entity';
import { Variant } from './variant.entity';

export enum VariantStatus {
  Available = 'available',
  Unvailable = 'unavailable',
}

@CoreEntity()
export class ProductVariant extends BaseEntity {
  @NotNullColumn()
  status: VariantStatus;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @JoinColumn()
  @ManyToOne(() => Variant, (variant) => variant.products, { nullable: true })
  variant: Variant;

  @Exclude()
  @OneToMany(() => ProductStock, (stock) => stock.variant)
  stocks: Promise<ProductStock[]>;

  @Exclude()
  @OneToMany(() => OrderProduct, (op) => op.product_variant)
  order_products: Promise<OrderProduct[]>;
}
