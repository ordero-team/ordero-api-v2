import { Category } from '@db/entities/owner/category.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class CategoryTransformer extends TransformerAbstract {
  transform(entity: Category) {
    return entity.toJSON();
  }
}
