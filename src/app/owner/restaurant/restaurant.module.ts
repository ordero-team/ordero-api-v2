import { Module } from '@nestjs/common';
import { OwnerCategoryModule } from './category/category.module';
import { OwnerLocationModule } from './location/location.module';
import { OwnerProductModule } from './product/product.module';
import { RestaurantController } from './restaurant.controller';
import { OwnerStaffModule } from './staff/staff.module';
import { OwnerTableModule } from './table/table.module';

@Module({
  imports: [OwnerLocationModule, OwnerTableModule, OwnerStaffModule, OwnerCategoryModule, OwnerProductModule],
  controllers: [RestaurantController],
  providers: [],
})
export class OwnerRestaurantModule {}
