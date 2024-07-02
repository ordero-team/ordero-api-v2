import { Module } from '@nestjs/common';
import { StafffNotificationModule } from './notification/notification.module';
import { StaffOrderModule } from './order/order.module';
import { StaffRestaurantController } from './restaurant.controller';

@Module({
  imports: [StaffOrderModule, StafffNotificationModule],
  controllers: [StaffRestaurantController],
  providers: [],
})
export class StaffRestaurantModule {}
