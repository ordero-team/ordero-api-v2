import { Module } from '@nestjs/common';
import { OwnerCategoryModule } from './category/category.module';
import { OwnerDashboardModule } from './dashboard/dashboard.module';
import { OwnerLocationModule } from './location/location.module';
import { OwnerNotificationModule } from './notification/notification.module';
import { OwnerOrderModule } from './order/order.module';
import { OwnerProductModule } from './product/product.module';
import { RestaurantController } from './restaurant.controller';
import { OwnerStaffModule } from './staff/staff.module';
import { OwnerStockModule } from './stock/stock.module';
import { OwnerTableModule } from './table/table.module';
import { OwnerVariantModule } from './variant/variant.module';

@Module({
  imports: [
    OwnerDashboardModule,
    OwnerLocationModule,
    OwnerTableModule,
    OwnerStaffModule,
    OwnerCategoryModule,
    OwnerVariantModule,
    OwnerProductModule,
    OwnerStockModule,
    OwnerOrderModule,
    OwnerNotificationModule,
  ],
  controllers: [RestaurantController],
  providers: [],
})
export class OwnerRestaurantModule {}
