import { VariantGroup } from '@db/entities/owner/variant-group.entity';
import { Variant } from '@db/entities/owner/variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { VariantTransformer } from './variant.transformer';

export class VariantGroupTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['variants'];
  }

  async includeVariants(entity: VariantGroup) {
    const variants = await Variant.findBy({ group_id: entity.id });
    return this.collection(variants, VariantTransformer);
  }

  transform(entity: VariantGroup) {
    return entity.toJSON();
  }
}
