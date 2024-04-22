import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerOrderModule } from './order/order.module';

@Module({
  imports: [CustomerAuthModule, CustomerOrderModule],
  controllers: [CustomerController],
  providers: [],
})
export class CustomerModule {}
