import { Media } from '@db/entities/core/media.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { RestaurantTransformer } from './restaurant.transformer';

export class OwnerTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['restaurant'];
  }

  get defaultInclude() {
    return ['restaurant'];
  }

  transform(entity: Owner) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...rest } = entity.toJSON();

    return {
      ...rest,
      avatar: Media.getImage(image),
    };
  }

  async includeRestaurant(entity: Owner) {
    const restaurant = await entity.restaurant;
    if (!restaurant) {
      return this.null();
    }

    return this.item(restaurant, RestaurantTransformer);
  }
}
