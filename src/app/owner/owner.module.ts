import { Module } from '@nestjs/common';
import { OwnerAuthModule } from './auth/auth.module';
import { OwnerProfileModule } from './profile/profile.module';
import { OwnerRestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [OwnerAuthModule, OwnerProfileModule, OwnerRestaurantModule],
  controllers: [],
  providers: [],
})
export class OwnerModule {}
