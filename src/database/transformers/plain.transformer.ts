import { BaseEntity } from '@db/entities/base/base';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class PlainTransformer extends TransformerAbstract {
  get availableInclude() {
    return [];
  }

  get defaultInclude() {
    return [];
  }

  transform(entity: BaseEntity) {
    return entity.toJSON();
  }
}
