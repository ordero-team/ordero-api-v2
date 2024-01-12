import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [AuthModule, ProfileModule, RestaurantModule],
  controllers: [],
  providers: [],
})
export class OwnerModule {}
