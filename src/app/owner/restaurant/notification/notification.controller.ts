import { Loc } from '@core/decorators/location.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Notification } from '@db/entities/core/notification.entity';
import { Location } from '@db/entities/owner/location.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { NotificationTransformer } from '@db/transformers/notification.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Body, Controller, Get, Put, Res, UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class NotificationController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Notification}@${PermAct.R}`)
  async index(@Rest() rest: Restaurant, @Loc() loc: Location, @Res() response) {
    const query = AppDataSource.createQueryBuilder(Notification, 't1').where({ restaurant_id: rest.id });

    if (loc) {
      query.andWhere('t1.location_id = :locId', { locId: loc.id });
    }

    const results = await query.search().sort().getPaged();
    await response.paginate(results, NotificationTransformer);
  }

  @Put()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Notification}@${PermAct.U}`)
  async mark(@Body() body, @Res() response) {
    const rules = {
      ids: `required|array|uid`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    await Notification.update({ id: In(body.ids) }, { is_read: true });
    return response.noContent();
  }
}
