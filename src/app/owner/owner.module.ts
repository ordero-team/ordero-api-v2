import { Module } from '@nestjs/common';
import { OwnerAuthModule } from './auth/auth.module';
import { OwnerProfileModule } from './profile/profile.module';

@Module({
  imports: [OwnerAuthModule, OwnerProfileModule],
  controllers: [],
  providers: [],
})
export class OwnerModule {}
