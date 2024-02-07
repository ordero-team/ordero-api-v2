import { Variant } from '@db/entities/owner/variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class VariantTransformer extends TransformerAbstract {
  transform(entity: Variant) {
    return entity.toJSON();
  }
}
