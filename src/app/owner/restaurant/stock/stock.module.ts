import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [],
})
export class OwnerStockModule {}
