import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { OrderController } from './order.controller';

@Module({
  imports: [],
  controllers: [OrderController, DetailController],
  providers: [],
})
export class OwnerOrderModule {}
