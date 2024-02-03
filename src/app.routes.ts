import { Routes } from 'nest-router';
import { OwnerAuthModule } from './app/owner/auth/auth.module';
import { OwnerModule } from './app/owner/owner.module';
import { OwnerProfileModule } from './app/owner/profile/profile.module';
import { OwnerCategoryModule } from './app/owner/restaurant/category/category.module';
import { OwnerLocationModule } from './app/owner/restaurant/location/location.module';
import { OwnerRestaurantModule } from './app/owner/restaurant/restaurant.module';
import { OwnerStaffModule } from './app/owner/restaurant/staff/staff.module';
import { OwnerTableModule } from './app/owner/restaurant/table/table.module';

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
          {
            path: '/:restaurant_id/tables',
            module: OwnerTableModule,
          },
          {
            path: '/:restaurant_id/staff',
            module: OwnerStaffModule,
          },
          {
            path: '/:restaurant_id/categories',
            module: OwnerCategoryModule,
          },
        ],
      },
    ],
  },
];
