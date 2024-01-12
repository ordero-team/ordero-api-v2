import { Routes } from 'nest-router';
import { AuthModule } from './app/owner/auth/auth.module';
import { OwnerModule } from './app/owner/owner.module';
import { ProfileModule } from './app/owner/profile/profile.module';
import { RestaurantModule } from './app/owner/restaurant/restaurant.module';

export const routes: Routes = [
  // { path: '/auth', module: AuthModule },
  // { path: '/me', module: ProfileModule },
  {
    path: '/owner',
    module: OwnerModule,
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/me', module: ProfileModule },
      { path: '/restaurants', module: RestaurantModule },
    ],
  },
];
