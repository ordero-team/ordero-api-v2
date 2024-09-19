import { Module } from '@nestjs/common';
import { StaffCategoryModule } from './category/category.module';
import { StaffDashboardModule } from './dashboard/dashboard.module';
import { StafffNotificationModule } from './notification/notification.module';
import { StaffOrderModule } from './order/order.module';
import { StaffProductModule } from './product/product.module';
import { StaffRestaurantController } from './restaurant.controller';
import { StaffStockModule } from './stock/stock.module';
import { StaffTableModule } from './table/table.module';
import { StaffVariantModule } from './variant/variant.module';

@Module({
  imports: [
    StaffStockModule,
    StaffTableModule,
    StaffCategoryModule,
    StaffVariantModule,
    StaffProductModule,
    StaffOrderModule,
    StafffNotificationModule,
    StaffDashboardModule,
  ],
  controllers: [StaffRestaurantController],
  providers: [],
})
export class StaffRestaurantModule {}
