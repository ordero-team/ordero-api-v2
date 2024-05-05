import { Restaurant, RestaurantStatus } from '@db/entities/owner/restaurant.entity';
import { RestaurantTransformer } from '@db/transformers/restaurant.transformer';
import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class RestaurantController {
  @Get()
  async getRestaurants(@Res() response) {
    const restaurant = await Restaurant.paginate({ where: { status: RestaurantStatus.Active } });
    return response.paginate(restaurant, RestaurantTransformer);
  }
}
