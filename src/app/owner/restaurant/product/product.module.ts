import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { ProductController } from './product.controller';
import { VariantController } from './variant.controller';

@Module({
  imports: [],
  controllers: [ProductController, DetailController, VariantController],
  providers: [],
})
export class OwnerProductModule {}
