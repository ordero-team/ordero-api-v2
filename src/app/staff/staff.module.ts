import { Module } from '@nestjs/common';
import { StaffAuthModule } from './auth/auth.module';
import { StaffProfileModule } from './profile/profile.module';
import { StaffCategoryModule } from './restaurant/category/category.module';
import { StaffProductModule } from './restaurant/product/product.module';
import { StaffRestaurantModule } from './restaurant/restaurant.module';
import { StaffStockModule } from './restaurant/stock/stock.module';
import { StaffTableModule } from './restaurant/table/table.module';
import { StaffVariantModule } from './restaurant/variant/variant.module';

@Module({
  imports: [
    StaffAuthModule,
    StaffProfileModule,
    StaffRestaurantModule,
    StaffStockModule,
    StaffTableModule,
    StaffCategoryModule,
    StaffVariantModule,
    StaffProductModule,
  ],
  controllers: [],
  providers: [],
})
export class StaffModule {}
