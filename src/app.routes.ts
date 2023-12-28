import { Routes } from 'nest-router';
import { OwnerAuthModule } from './app/owner/auth/auth.module';
import { OwnerModule } from './app/owner/owner.module';

export const routes: Routes = [
  // { path: '/auth', module: AuthModule },
  // { path: '/me', module: ProfileModule },
  {
    path: '/owner',
    module: OwnerModule,
    children: [{ path: '/auth', module: OwnerAuthModule }],
  },
];
