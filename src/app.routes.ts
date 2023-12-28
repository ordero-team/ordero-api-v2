import { AuthModule } from '@private/auth/auth.module';
import { ProfileModule } from '@private/profile/profile.module';
import { Ver1OrderModule } from '@v1/order/order.module';
import { Ver1ProductModule } from '@v1/product/product.module';
import { V1Module } from '@v1/v1.module';
import { Routes } from 'nest-router';

export const routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/me', module: ProfileModule },
  {
    path: '/v1',
    module: V1Module,
    children: [
      { path: '/products', module: Ver1ProductModule },
      { path: '/orders', module: Ver1OrderModule },
    ],
  },
];
