import { BaseEntity } from '@db/entities/base/base';
import { CoreEntity, ForeignColumn, PriceColumn, StatusColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { ProductVariant } from '../owner/product-variant.entity';
import { Order } from './order.entity';

export enum OrderProductStatus {
  WaitingApproval = 'waiting_approval',
  Preparing = 'preparing',
  Served = 'served',
  Cancelled = 'cancelled',
}

@CoreEntity()
export class OrderProduct extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  order_id: string;

  @JoinColumn()
  @ManyToOne(() => Order, (cust) => cust.order_products, { onDelete: 'CASCADE' })
  order: Promise<Order>;

  @Exclude()
  @ForeignColumn()
  product_variant_id: string;

  @JoinColumn()
  @ManyToOne(() => ProductVariant, (pv) => pv.order_products, { onDelete: 'CASCADE' })
  product_variant: Promise<ProductVariant>;

  @Column({ type: 'integer', default: 0 })
  qty: number;

  @PriceColumn()
  price: number;

  @StatusColumn()
  status: OrderProductStatus;
}
