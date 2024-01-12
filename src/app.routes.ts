import { Routes } from 'nest-router';
import { OwnerAuthModule } from './app/owner/auth/auth.module';
import { OwnerModule } from './app/owner/owner.module';
import { OwnerProfileModule } from './app/owner/profile/profile.module';
import { OwnerLocationModule } from './app/owner/restaurant/location/location.module';
import { OwnerRestaurantModule } from './app/owner/restaurant/restaurant.module';

export const routes: Routes = [
  // { path: '/auth', module: AuthModule },
  // { path: '/me', module: ProfileModule },
  {
    path: '/owner',
    module: OwnerModule,
    children: [
      { path: '/auth', module: OwnerAuthModule },
      { path: '/me', module: OwnerProfileModule },
      {
        path: '/restaurants',
        module: OwnerRestaurantModule,
        children: [
          {
            path: '/:restaurant_id/locations',
            module: OwnerLocationModule,
          },
        ],
      },
    ],
  },
];
