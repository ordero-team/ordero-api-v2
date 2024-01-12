import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule {}
