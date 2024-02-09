import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { LocationTransformer } from './location.transformer';
import { ProductVariantTransformer } from './product-variant.transformer';

export class StockTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['item', 'location'];
  }

  async includeItem(entity: ProductStock) {
    const productVariant = await entity.variant;
    if (!productVariant) {
      return this.null();
    }

    return this.item(productVariant, ProductVariantTransformer);
  }

  async includeLocation(entity: ProductStock) {
    const location = await entity.location;
    if (!location) {
      return this.null();
    }

    return this.item(location, LocationTransformer);
  }

  transform(entity: ProductStock) {
    return entity.toJSON();
  }
}
