import { Module } from '@nestjs/common';
import { OwnerLocationModule } from './location/location.module';
import { RestaurantController } from './restaurant.controller';
import { OwnerStaffModule } from './staff/staff.module';
import { OwnerTableModule } from './table/table.module';

@Module({
  imports: [OwnerLocationModule, OwnerTableModule, OwnerStaffModule],
  controllers: [RestaurantController],
  providers: [],
})
export class OwnerRestaurantModule {}
