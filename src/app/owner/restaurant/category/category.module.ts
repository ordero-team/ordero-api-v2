import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [],
})
export class OwnerCategoryModule {}
