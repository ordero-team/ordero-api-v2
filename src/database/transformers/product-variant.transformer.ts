import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { ProductTransformer } from './product.transformer';
import { VariantTransformer } from './variant.transformer';

export class ProductVariantTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['product', 'variant'];
  }

  async includeProduct(entity: ProductVariant) {
    const product = await entity.product;
    if (!product) {
      return this.null();
    }

    return this.item(product, ProductTransformer);
  }

  async includeVariant(entity: ProductVariant) {
    const variant = await entity.variant;
    if (!variant) {
      return this.null();
    }

    return this.item(variant, VariantTransformer);
  }

  transform(entity: ProductVariant) {
    return entity.toJSON();
  }
}
