import { Module } from '@nestjs/common';
import { TableController } from './table.controller';

@Module({
  imports: [],
  controllers: [TableController],
  providers: [],
})
export class StaffTableModule {}
