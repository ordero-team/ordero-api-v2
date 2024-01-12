import { Owner } from '@db/entities/owner/owner.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { Restaurant } from '../entities/owner/restaurant.entity';
import { OwnerTransformer } from './owner.transformer';

export class RestaurantTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['owner'];
  }

  transform(entity: Restaurant) {
    return entity.toJSON();
  }

  async includeOwner(entity: Restaurant) {
    let owner = entity.owner;
    if (!owner) {
      owner = await Owner.findOneBy({ id: entity.owner_id });
      if (!owner) {
        return this.null();
      }
    }

    return this.item(owner, OwnerTransformer);
  }
}
