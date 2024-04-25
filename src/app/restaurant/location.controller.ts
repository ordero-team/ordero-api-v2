import { Location } from '@db/entities/owner/location.entity';
import { Product } from '@db/entities/owner/product.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { LocationTransformer } from '@db/transformers/location.transformer';
import { ProductTransformer } from '@db/transformers/product.transformer';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('restaurants/:restaurant_id/locations')
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

  @Get(':menu_id')
  async getMenu(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    const menu = await Product.findOneOrFail({ where: { id: params.menu_id, restaurant_id: restaurant.id } });
    await response.item(menu, ProductTransformer);
  }

  @Get(':location_id')
  async show(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });

    const location = await Location.findOneByOrFail({ restaurant_id: restaurant.id, id: params.location_id });
    await response.item(location, LocationTransformer);
  }

  // @TODO: Show Menus by selected location
}
