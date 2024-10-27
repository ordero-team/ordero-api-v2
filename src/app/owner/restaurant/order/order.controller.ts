import { Loc } from '@core/decorators/location.decorator';
import { Quero } from '@core/decorators/quero.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Order } from '@db/entities/core/order.entity';
import { Location } from '@db/entities/owner/location.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { Table } from '@db/entities/owner/table.entity';
import { OrderTransformer } from '@db/transformers/order.transformer';
import { config } from '@lib/helpers/config.helper';
import { time } from '@lib/helpers/time.helper';
import { writeFile } from '@lib/helpers/utils.helper';
import Logger from '@lib/logger/logger.library';
import Socket, { PubSubEventType, PubSubPayloadType, PubSubStatus } from '@lib/pubsub/pubsub.lib';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Controller()
@UseGuards(OwnerAuthGuard())
export class OrderController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Order}@${PermAct.R}`)
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

  @Get('export')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Order}@${PermAct.R}`)
  async export(@Me() me: Owner, @Rest() rest: Restaurant, @Loc() loc: Location, @Res() response, @Quero() quero) {
    const request_id = uuid();

    const processing = async (): Promise<string> => {
      const query = AppDataSource.createQueryBuilder(Order, 't1')
        .leftJoin(Table, 't2', 't1.table_id = t2.id')
        .leftJoin(Location, 't3', 't1.location_id = t3.id');

      query.where('t1.restaurant_id = :restId', { restId: rest.id });

      if (loc) {
        query.andWhere('t1.location_id = :locId', { locId: loc.id });
      }

      if (quero.status) {
        query.andWhere('t1.status = :status', { status: quero.status });
      }

      query.selectWithAlias([
        '_t1.id AS id',
        '_t1.number AS number',
        '_t1.gross_total AS gross_total',
        '_t1.discount AS discount',
        '_t1.net_total AS net_total',
        '_t1.status AS status',
        '_t1.billed_at AS billed_at',
        '_t2.number AS table_number',
        '_t3.name AS location_name',
        '_t1.customer_name AS customer_name',
        '_t1.customer_phone AS customer_phone',
      ]);

      query.orderBy('t1.created_at', 'DESC');

      const results = await query.search().dateRange().getRawMany();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');

      worksheet.columns = [
        { header: 'id', key: 'id' },
        { header: 'number', key: 'number' },
        { header: 'gross_total', key: 'gross_total' },
        { header: 'discount', key: 'discount' },
        { header: 'net_total', key: 'net_total' },
        { header: 'status', key: 'status' },
        { header: 'billed_at', key: 'billed_at' },
        { header: 'table', key: 'table_number' },
        { header: 'location', key: 'location_name' },
        { header: 'customer_name', key: 'customer_name' },
        { header: 'customer_phone', key: 'customer_phone' },
      ];

      for (const result of results) {
        worksheet.addRow({
          ...result,
          billed_at: result.billed_at
            ? time(result.billed_at).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss').toString()
            : '-',
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const dir = `${config.getPublicPath()}/files`;
      const filename = `${time().unix()}-orders.xlsx`;
      return writeFile(dir, filename, buffer);
    };

    processing()
      .then((path) => {
        // send event
        Socket.getInstance().event(me.id, {
          request_id,
          status: PubSubStatus.Success,
          type: PubSubEventType.OwnerGetOrderExcel,
          payload: {
            type: PubSubPayloadType.Download,
            body: {
              mime: 'text/href',
              name: `${time().unix()}-orders.xlsx`,
              content: config.getDownloadURI(path),
            },
          },
        });
      })
      .catch(async (error) => {
        // send event
        Socket.getInstance().event(me.id, {
          request_id,
          status: PubSubStatus.Fail,
          type: PubSubEventType.OwnerGetOrderExcel,
          error: error.message,
        });

        Logger.getInstance().notify(error);
      });

    return response.data({ request_id });
  }
}
