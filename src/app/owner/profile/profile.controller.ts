import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermOwner } from '@core/services/role.service';
import { Permissions } from '@lib/rbac';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { PermAct } from '../../../core/services/role.service';

@Controller()
@UseGuards(OwnerAuthGuard())
export class ProfileController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Profile}@${PermAct.R}`)
  async me(@Me() me, @Res() response) {
    return response.data(me);
  }
}
