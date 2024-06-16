import { Media } from '@db/entities/core/media.entity';
import { OrderProduct, OrderProductStatus } from '@db/entities/core/order-product.entity';
import { Order } from '@db/entities/core/order.entity';
import { Product } from '@db/entities/owner/product.entity';
import { Variant } from '@db/entities/owner/variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { RawTransformer } from './raw.transformer';

export class OrderTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['items', 'table', 'stats'];
  }

  async includeItems(entity: Order) {
    const orderProducts = await entity.order_products;
    if (!orderProducts) {
      return this.null();
    }

    const items: {
      id: string;
      qty: number;
      price: number;
      status: OrderProductStatus;
      product: Product;
      images: Media[];
      variant: Variant;
    }[] = [];
    if (orderProducts.length > 0) {
      for (const orderProduct of orderProducts) {
        const productVar = await orderProduct.product_variant;
        const product = await productVar.product;
        const variant = await productVar.variant;
        const images = await Media.findBy({ product_id: product.id });

        items.push({
          id: orderProduct.id,
          qty: orderProduct.qty,
          price: orderProduct.price,
          status: orderProduct.status,
          product,
          images,
          variant,
        });
      }
    }

    return this.collection(items, RawTransformer);
  }

  async includeTable(entity: Order) {
    return await entity.table;
  }

  async includeStats(entity: Order) {
    const data = { total_items: 0, total_preparing_items: 0 };

    data.total_items = await OrderProduct.countBy({ order_id: entity.id });
    data.total_preparing_items = await OrderProduct.countBy({ order_id: entity.id, status: OrderProductStatus.Preparing });

    return this.item(data, RawTransformer);
  }

  transform(entity: Order) {
    return entity.toJSON();
  }
}
