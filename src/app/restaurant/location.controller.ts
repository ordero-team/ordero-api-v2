import { Location } from '@db/entities/owner/location.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { LocationTransformer } from '@db/transformers/location.transformer';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller(':restaurant_id/locations')
export class LocationController {
  @Get()
  async getLocations(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    const locations = await AppDataSource.createQueryBuilder(Location, 't1')
      .where({ restaurant_id: restaurant.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(locations, LocationTransformer);
  }

  @Get(':location_id')
  async show(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });

    const location = await Location.findOneByOrFail({ restaurant_id: restaurant.id, id: params.location_id });
    await response.item(location, LocationTransformer);
  }

  // @TODO: Show Menus by selected location
}
