import { Owner } from '@db/entities/owner/owner.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class LocationTransformer extends TransformerAbstract {
  transform(entity: Owner) {
    return entity.toJSON();
  }
}
