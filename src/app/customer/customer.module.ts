import { Module } from '@nestjs/common';
import { CustomerAuthModule } from './auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerOrderModule } from './order/order.module';
import { CustomerTableModule } from './table/table.module';

@Module({
  imports: [CustomerAuthModule, CustomerOrderModule, CustomerTableModule],
  controllers: [CustomerController],
  providers: [],
})
export class CustomerModule {}
