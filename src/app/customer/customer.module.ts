import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerOrderModule } from './order/order.module';

@Module({
  imports: [CustomerOrderModule],
  controllers: [CustomerController],
  providers: [],
})
export class CustomerModule {}
