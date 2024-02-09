import { Variant } from '@db/entities/owner/variant.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { VariantGroupTransformer } from './variant-group.transformer';

export class VariantTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['group'];
  }

  async includeGroup(entity: Variant) {
    const group = await entity.group;
    if (!group) {
      return this.null();
    }

    return this.item(group, VariantGroupTransformer);
  }

  transform(entity: Variant) {
    return entity.toJSON();
  }
}
