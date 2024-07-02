import { Media } from '@db/entities/core/media.entity';
import { StaffRole } from '@db/entities/staff/role.entity';
import { StaffUser } from '@db/entities/staff/user.entity';
import { encrypt } from '@lib/helpers/encrypt.helper';
import { RequestHelper } from '@lib/helpers/request.helper';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { LocationTransformer } from './location.transformer';
import { RestaurantTransformer } from './restaurant.transformer';

export class StaffTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['restaurant', 'location', 'role'];
  }

  get defaultInclude() {
    return [];
  }

  transform(entity: StaffUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...rest } = entity.toJSON();

    return {
      ...rest,
      avatar: Media.getImage(entity.image),
    };
  }

  async transformWithPermission(entity: StaffUser) {
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

  async includeRestaurant(entity: StaffUser) {
    const restaurant = await entity.restaurant;
    if (!restaurant) {
      return this.null();
    }

    return this.item(restaurant, RestaurantTransformer);
  }

  async includeLocation(entity: StaffUser) {
    const location = await entity.location;
    if (!location) {
      return this.null();
    }

    return this.item(location, LocationTransformer);
  }

  async includeRole(entity: StaffUser) {
    const role = await StaffRole.findOneBy({ slug: entity.role_slug });
    if (!role) {
      return this.null();
    }

    const grants = RequestHelper.getPermissionGrants();
    return { id: role.id, name: role.slug, permissions: encrypt(grants[role.slug]) };
  }
}
