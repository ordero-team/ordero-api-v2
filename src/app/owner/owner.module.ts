import { Module } from '@nestjs/common';
import { OwnerAuthModule } from './auth/auth.module';

@Module({
  imports: [OwnerAuthModule],
  controllers: [],
  providers: [],
})
export class OwnerModule {}
