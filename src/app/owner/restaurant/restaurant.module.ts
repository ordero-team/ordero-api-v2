import { Module } from '@nestjs/common';
import { OwnerLocationModule } from './location/location.module';
import { RestaurantController } from './restaurant.controller';
import { OwnerTableModule } from './table/table.module';

@Module({
  imports: [OwnerLocationModule, OwnerTableModule],
  controllers: [RestaurantController],
  providers: [],
})
export class OwnerRestaurantModule {}
