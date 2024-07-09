import { Media } from '@db/entities/core/media.entity';
import { Category } from '@db/entities/owner/category.entity';
import { Product } from '@db/entities/owner/product.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { In } from 'typeorm';
import { CategoryTransformer } from './category.transformer';
import { MediaTransformer } from './media.transformer';
import { ProductVariantTransformer } from './product-variant.transformer';
import { RawTransformer } from './raw.transformer';

export class ProductTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['variants', 'categories', 'images', 'stocks'];
  }

  async includeVariants(entity: Product) {
    const productVariants = await entity.variants;
    if (!productVariants) {
      return this.null();
    }

    return this.collection(productVariants, ProductVariantTransformer);
  }

  async includeCategories(entity: Product) {
    const productCategories = await entity.categories;
    if (!productCategories) {
      return this.null();
    }

    let categories: Category[] = [];
    if (productCategories.filter((val) => val.category_id).length > 0) {
      categories = await Category.findBy({ id: In(productCategories.map((val) => val.category_id)) });
    }

    return this.collection(categories, CategoryTransformer);
  }

  async includeImages(entity: Product) {
    const media = await Media.find({ where: { product_id: entity.id } });
    return this.collection(media, MediaTransformer);
  }

  async includeStocks(entity: Product) {
    const stocks = await entity.stocks;
    if (!stocks) {
      return this.null();
    }

    return this.collection(stocks, RawTransformer);
  }

  transform(entity: Product) {
    return entity.toJSON();
  }
}
