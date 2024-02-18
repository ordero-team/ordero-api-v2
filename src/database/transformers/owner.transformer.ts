import { Media } from '@db/entities/core/media.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { encrypt } from '@lib/helpers/encrypt.helper';
import { RequestHelper } from '@lib/helpers/request.helper';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { LocationTransformer } from './location.transformer';
import { RestaurantTransformer } from './restaurant.transformer';

export class OwnerTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['role', 'restaurant', 'location'];
  }

  transform(entity: Owner) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...rest } = entity.toJSON();

    return {
      ...rest,
      avatar: Media.getImage(image),
    };
  }

  async transformWithPermission(entity: Owner) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...rest } = entity.toJSON();

    const grants = RequestHelper.getPermissionGrants();
    const role = await entity.role;
    const location = await entity.location;
    return {
      ...rest,
      role: {
        id: role.id,
        name: role.slug,
        permissions: encrypt(grants[role.slug]),
      },
      location: location
        ? {
            id: location.id,
            name: location.name,
          }
        : null,
      avatar: Media.getImage(entity.image),
    };
  }

  async includeRole(entity: Owner) {
    const role = await entity.role;
    if (!role) {
      return this.null();
    }

    const grants = RequestHelper.getPermissionGrants();
    return { id: role.id, name: role.slug, permissions: encrypt(grants[role.slug]) };
  }

  async includeRestaurant(entity: Owner) {
    const restaurant = await entity.restaurant;
    if (!restaurant) {
      return this.null();
    }

    return this.item(restaurant, RestaurantTransformer);
  }

  async includeLocation(entity: Owner) {
    const location = await entity.location;
    if (!location) {
      return this.null();
    }

    return this.item(location, LocationTransformer);
  }
}
