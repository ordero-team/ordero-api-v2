import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { MenuController } from './menu.controller';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [],
  controllers: [RestaurantController, DetailController, MenuController],
  providers: [],
})
export class RestaurantModule {}
