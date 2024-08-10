import { Loc } from '@core/decorators/location.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PermAct, PermStaff } from '@core/services/role.service';
import { OrderProduct } from '@db/entities/core/order-product.entity';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Location } from '@db/entities/owner/location.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { getChartData } from '@lib/helpers/utils.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(StaffAuthGuard(), StaffGuard)
export class DashboardController {
  @Get('orders/total')
  @Permissions(`${PermStaff.Dashboard}@${PermAct.R}`)
  async orderTotal(@Rest() rest, @Loc() loc: Location, @Res() response) {
    const query = AppDataSource.createQueryBuilder(Order, 't1').where({ restaurant_id: rest.id });

    if (loc) {
      query.andWhere({ location_id: loc.id });
    }

    const data = await query.search().dateRange().getCount();
    return response.data({ id: uuid(), data });
  }

  @Get('sales/total')
  @Permissions(`${PermStaff.Dashboard}@${PermAct.R}`)
  async salesTotal(@Rest() rest, @Loc() loc: Location, @Res() response) {
    const query = AppDataSource.createQueryBuilder(Order, 't1').where({ restaurant_id: rest.id });

    if (loc) {
      query.andWhere({ location_id: loc.id });
    }

    query.selectWithAlias([
      '_UUID() as id',
      '_IFNULL(SUM(t1.gross_total),0) AS total',
      '_IFNULL(SUM(t1.net_total),0) AS net_total',
    ]);

    const data = await query.search().dateRange().getRawOne();
    return response.data({ id: uuid(), data });
  }

  @Get('sales/chart')
  @Permissions(`${PermStaff.Dashboard}@${PermAct.R}`)
  async salesChart(@Rest() rest, @Loc() loc: Location, @Res() response) {
    const query = AppDataSource.createQueryBuilder(Order, 't1')
      .where({ restaurant_id: rest.id })
      .andWhere('t1.status = :status', { status: OrderStatus.Completed })
      .groupBy('t1.created_at')
      .selectWithAlias(['_IFNULL(SUM(t1.net_total),0) AS net_total', 'created_at']);

    if (loc) {
      query.andWhere({ location_id: loc.id });
    }
    const orders = await query.dateRange().getRawMany();

    const { start, end } = AppDataSource.createQueryBuilder(Order, 't1').dateRange().getParameters();
    const results = await getChartData({ start, end }, orders, 'net_total');

    return response.data(results);
  }

  @Get('top/menus')
  @Permissions(`${PermStaff.Dashboard}@${PermAct.R}`)
  async topMenus(@Rest() rest, @Loc() loc: Location, @Res() response) {
    const query = AppDataSource.createQueryBuilder(OrderProduct, 't1')
      .leftJoin(Order, 't2', 't1.order_id = t2.id')
      .leftJoin(ProductVariant, 't3', 't1.product_variant_id = t3.id')
      .leftJoin(Product, 't4', 't3.product_id = t4.id')
      .where('t2.restaurant_id = :restId', { restId: rest.id })
      .andWhere('t2.status NOT IN (:status)', { status: [OrderStatus.Cancelled] });

    if (loc) {
      query.andWhere('t2.location_id = :locId', { locId: loc.id });
    }

    query
      .selectWithAlias(['_(t1.product_variant_id) AS id', 't4.name', 't4.sku', '_COUNT(t1.product_variant_id) AS count'])
      .groupBy('t1.product_variant_id')
      .orderBy('count', 'DESC')
      .limit(5);

    const results = await query.dateRange().getRawMany();

    return response.data(results);
  }
}
