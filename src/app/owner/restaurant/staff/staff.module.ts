import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { StaffController } from './staff.controller';

@Module({
  imports: [],
  controllers: [StaffController, RoleController],
  providers: [],
})
export class OwnerStaffModule {}
