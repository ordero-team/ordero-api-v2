import { Order } from '@db/entities/core/order.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { In } from 'typeorm';
import { ProductVariantTransformer } from './product-variant.transformer';

export class OrderTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['items'];
  }

  async includeItems(entity: Order) {
    const orderProducts = await entity.order_products;
    if (!orderProducts) {
      return this.null();
    }

    let items: ProductVariant[] = [];
    if (orderProducts.filter((val) => val.product_variant_id).length > 0) {
      items = await ProductVariant.findBy({ id: In(orderProducts.map((val) => val.product_variant_id)) });
    }

    return this.collection(items, ProductVariantTransformer);
  }

  transform(entity: Order) {
    return entity.toJSON();
  }
}
