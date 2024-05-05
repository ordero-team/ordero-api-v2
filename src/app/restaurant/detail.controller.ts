import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { RestaurantTransformer } from '@db/transformers/restaurant.transformer';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller(':restaurant_id')
export class DetailController {
  @Get()
  async getRestaurant(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    return response.item(restaurant, RestaurantTransformer);
  }
}
