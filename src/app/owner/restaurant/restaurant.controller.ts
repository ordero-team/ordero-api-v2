import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { RestaurantTransformer } from '@db/transformers/restaurant.transformer';
import { Permissions } from '@lib/rbac';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(OwnerAuthGuard())
export class RestaurantController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.R}`)
  async me(@Rest() rest, @Res() response) {
    return response.item(rest, RestaurantTransformer);
  }
}
