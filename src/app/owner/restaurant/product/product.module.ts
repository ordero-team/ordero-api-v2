import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [],
  controllers: [ProductController, DetailController],
  providers: [],
})
export class OwnerProductModule {}
