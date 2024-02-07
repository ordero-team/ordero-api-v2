import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';

@Module({
  imports: [],
  controllers: [VariantController],
  providers: [],
})
export class OwnerVariantModule {}
