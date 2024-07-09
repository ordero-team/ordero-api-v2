import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { DetailController } from './detail.controller';
import { ProductController } from './product.controller';
import { VariantController } from './variant.controller';

@Module({
  imports: [],
  controllers: [ProductController, DetailController, CategoryController, VariantController],
  providers: [],
})
export class StaffProductModule {}
