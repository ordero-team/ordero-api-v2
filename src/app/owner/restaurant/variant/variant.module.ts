import { Module } from '@nestjs/common';
import { VariantGroupController } from './group.controller';
import { VariantController } from './variant.controller';

@Module({
  imports: [],
  controllers: [VariantController, VariantGroupController],
  providers: [],
})
export class OwnerVariantModule {}
