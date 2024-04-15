import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [],
})
export class CustomerOrderModule {}
