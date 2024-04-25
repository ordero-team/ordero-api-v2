import { Routes } from 'nest-router';
import { CustomerAuthModule } from './app/customer/auth/auth.module';
import { CustomerModule } from './app/customer/customer.module';
import { CustomerOrderModule } from './app/customer/order/order.module';
import { OwnerAuthModule } from './app/owner/auth/auth.module';
import { OwnerModule } from './app/owner/owner.module';
import { OwnerProfileModule } from './app/owner/profile/profile.module';
import { OwnerCategoryModule } from './app/owner/restaurant/category/category.module';
import { OwnerLocationModule } from './app/owner/restaurant/location/location.module';
import { OwnerProductModule } from './app/owner/restaurant/product/product.module';
import { OwnerRestaurantModule } from './app/owner/restaurant/restaurant.module';
import { OwnerStaffModule } from './app/owner/restaurant/staff/staff.module';
import { OwnerStockModule } from './app/owner/restaurant/stock/stock.module';
import { OwnerTableModule } from './app/owner/restaurant/table/table.module';
import { OwnerVariantModule } from './app/owner/restaurant/variant/variant.module';

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
          {
            path: '/:restaurant_id/variants',
            module: OwnerVariantModule,
          },
          {
            path: '/:restaurant_id/products',
            module: OwnerProductModule,
          },
          {
            path: '/:restaurant_id/stocks',
            module: OwnerStockModule,
          },
        ],
      },
    ],
  },

  {
    path: '/customers',
    module: CustomerModule,
    children: [
      {
        path: '/auth',
        module: CustomerAuthModule,
      },
      {
        path: '/orders',
        module: CustomerOrderModule,
      },
    ],
  },
];
