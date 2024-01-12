import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { RestaurantTransformer } from '@db/transformers/restaurant.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { Body, Controller, Get, Put, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(OwnerAuthGuard())
export class RestaurantController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.R}`)
  async me(@Rest() rest, @Res() response) {
    return response.item(rest, RestaurantTransformer);
  }

  @Put()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.U}`)
  async update(@Rest() rest: Restaurant, @Body() body, @Res() response) {
    const rules = {
      name: 'required',
      phone: 'required|phone|unique',
      email: 'email',
      website: 'url',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    rest.name = body.name;
    rest.phone = body.phone;
    rest.email = body.email;
    rest.website = body.website;
    await rest.save();

    return response.item(rest, RestaurantTransformer);
  }
}
