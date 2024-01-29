import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { StaffRole } from '@db/entities/staff/role.entity';
import { RawTransformer } from '@db/transformers/raw.transformer';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';

@Controller('roles')
@UseGuards(OwnerAuthGuard())
export class RoleController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Role}@${PermAct.R}`)
  async index(@Res() response) {
    const roles = await AppDataSource.createQueryBuilder(StaffRole, 't1').search().sort().getPaged();
    await response.paginate(roles, RawTransformer);
  }
}
