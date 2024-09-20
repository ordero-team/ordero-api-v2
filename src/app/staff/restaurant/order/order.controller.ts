import { Loc } from '@core/decorators/location.decorator';
import { Quero } from '@core/decorators/quero.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PermAct, PermStaff } from '@core/services/role.service';
import { Order } from '@db/entities/core/order.entity';
import { Location } from '@db/entities/owner/location.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(StaffAuthGuard())
export class OrderController {
  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Order}@${PermAct.R}`)
  async index(@Rest() rest: Restaurant, @Loc() loc: Location, @Res() response, @Quero() quero) {
    const query = AppDataSource.createQueryBuilder(Order, 't1').where({ restaurant_id: rest.id });

    if (loc) {
      query.andWhere('t1.location_id = :locId', { locId: loc.id });
    }

    if (quero.status) {
      query.andWhere('t1.status = :status', { status: quero.status });
    }

    const results = await query.search().sort().dateRange().getPaged();
    await response.paginate(results, OrderTransformer);
  }
}
