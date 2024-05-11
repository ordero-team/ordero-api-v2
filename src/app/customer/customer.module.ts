import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerOrderModule } from './order/order.module';
import { TableController } from './table.controller';

@Module({
  imports: [CustomerAuthModule, CustomerOrderModule],
  controllers: [CustomerController, TableController],
  providers: [],
})
export class CustomerModule {}
