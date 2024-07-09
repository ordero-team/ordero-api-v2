import { Module } from '@nestjs/common';
import { StaffAuthModule } from './auth/auth.module';
import { StaffProfileModule } from './profile/profile.module';
import { StaffRestaurantModule } from './restaurant/restaurant.module';
import { StaffStockModule } from './restaurant/stock/stock.module';
import { StaffTableModule } from './restaurant/table/table.module';

@Module({
  imports: [StaffAuthModule, StaffProfileModule, StaffRestaurantModule, StaffStockModule, StaffTableModule],
  controllers: [],
  providers: [],
})
export class StaffModule {}
