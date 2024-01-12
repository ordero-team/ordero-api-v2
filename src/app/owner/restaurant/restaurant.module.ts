import { Module } from '@nestjs/common';
import { OwnerLocationModule } from './location/location.module';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [OwnerLocationModule],
  controllers: [RestaurantController],
  providers: [],
})
export class OwnerRestaurantModule {}
