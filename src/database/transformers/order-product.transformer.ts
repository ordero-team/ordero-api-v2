import { OrderProduct } from '@db/entities/core/order-product.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { ProductVariantTransformer } from './product-variant.transformer';

export class OrderProductTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['item'];
  }

  async includeItem(entity: OrderProduct) {
    const product = await entity.product_variant;
    if (!product) {
      return this.null();
    }
    return this.item(product, ProductVariantTransformer);
  }

  transform(entity: OrderProduct) {
    return entity.toJSON();
  }
}
