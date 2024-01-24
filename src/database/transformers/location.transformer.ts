import { Location } from '@db/entities/owner/location.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class LocationTransformer extends TransformerAbstract {
  transform(entity: Location) {
    return entity.toJSON();
  }
}
