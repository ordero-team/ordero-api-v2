import { Loc } from '@core/decorators/location.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PdfService } from '@core/services/pdf.service';
import { PermAct, PermOwner } from '@core/services/role.service';
import { UtilService } from '@core/services/util.service';
import { Order, OrderStatus } from '@db/entities/core/order.entity';
import { Location } from '@db/entities/owner/location.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { TableTransformer } from '@db/transformers/table.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { config } from '@lib/helpers/config.helper';
import { time } from '@lib/helpers/time.helper';
import { writeFile } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import Logger from '@lib/logger/logger.library';
import Socket, { PubSubEventType, PubSubPayloadType, PubSubStatus } from '@lib/pubsub/pubsub.lib';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { In, Not } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class TableController {
  constructor(private pdf: PdfService, private util: UtilService) {}

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response, @Loc() loc: Location) {
    const tables = AppDataSource.createQueryBuilder(Table, 't1');
    tables.where({ restaurant_id: rest.id });

    if (loc && loc.id) {
      tables.andWhere({ location_id: loc.id });
    }

    const data = await tables.search().sort().getPaged();

    await response.paginate(data, TableTransformer);
  }

  @Get('/:table_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const table = await Table.findOneByOrFail({ restaurant_id: rest.id, id: param.table_id });
    await response.item(table, TableTransformer);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.C}`)
  async create(@Rest() rest: Restaurant, @Body() body, @Res() response) {
    const rules = {
      number: 'required|unique|safe_text',
      location_id: 'required',
      status: `required|in:${Object.values(TableStatus).join(',')}`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const loc = await Location.findOneByOrFail({ id: body.location_id });

    const tableExist = await Table.exists({ where: { number: body.number, restaurant_id: rest.id, location_id: loc.id } });
    if (tableExist) {
      throw new BadRequestException('Table has already existed.');
    }

    const table = new Table();
    table.number = body.number;
    table.status = body.status;
    table.location_id = loc.id;
    table.restaurant_id = rest.id;
    await table.save();

    return response.item(table, TableTransformer);
  }

  @Put('/:table_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.U}`)
  async update(@Rest() rest: Restaurant, @Body() body, @Res() response, @Param() param) {
    const rules = {
      number: 'required|unique|safe_text',
      location_id: 'required',
      status: `required|in:${Object.values(TableStatus).join(',')}`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.table_id) {
      throw new BadRequestException();
    }

    const table = await Table.findOneByOrFail({ id: param.table_id });

    if (table.status === TableStatus.InUse) {
      const isUsedByOrder = await Order.findOneBy({
        table_id: table.id,
        status: Not(In([OrderStatus.Completed, OrderStatus.Cancelled])),
      });
      if (isUsedByOrder) {
        throw new BadRequestException(`Table is still used for ${isUsedByOrder.number} (${isUsedByOrder.customer_name})`);
      }
    }

    const loc = await Location.findOneByOrFail({ id: table.location_id });

    const tableExist = await Table.exists({
      where: { number: body.number, restaurant_id: rest.id, location_id: loc.id, id: Not(table.id) },
    });
    if (tableExist) {
      throw new BadRequestException('Table has already existed.');
    }

    table.number = body.number;
    table.status = body.status;
    await table.save();

    return response.item(table, TableTransformer);
  }

  @Post('/label')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.U}`)
  async generateLabel(@Body() body, @Res() response, @Me() me: Owner, @Rest() restaurant: Restaurant) {
    const rules = {
      table_ids: 'required|array|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const request_id = uuid();
    const processing = async (): Promise<string> => {
      const data = [];
      const tables = await Table.find({ where: { id: In(body.table_ids) } });
      const locations = await Location.find({ where: { id: In(tables.map((val) => val.location_id)) } });
      for (const table of tables) {
        const url = `${config.getAppURI()}/tables/${table.id}`;
        const barcode = await this.util.getQrCode(url, { scale: 2 });
        const location = locations.find((val) => val.id === table.location_id);
        data.push({
          name: table.number,
          restaurant: restaurant.name,
          location: location.name,
          barcode: `data:image/png;base64,${barcode.toString('base64')}`,
        });
      }

      const pdf = await this.pdf.tableLabel(data);
      const dir = `${config.getPublicPath()}/files`;
      const filename = `${time().unix()}-tables-label.pdf`;
      return writeFile(dir, filename, pdf);
    };

    processing()
      .then((path) => {
        // send event
        Socket.getInstance().event(me.id, {
          request_id,
          status: PubSubStatus.Success,
          type: PubSubEventType.OwnerGetTableLabel,
          payload: {
            type: PubSubPayloadType.Download,
            body: {
              mime: 'text/href',
              name: `${time().unix()}-tables-label.pdf`,
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
          type: PubSubEventType.OwnerGetTableLabel,
          error: error.message,
        });

        Logger.getInstance().notify(error);
      });

    return response.data({ request_id });
  }
}
