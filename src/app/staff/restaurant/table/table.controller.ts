import { Loc } from '@core/decorators/location.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { Me } from '@core/decorators/user.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PdfService } from '@core/services/pdf.service';
import { PermAct, PermStaff } from '@core/services/role.service';
import { UtilService } from '@core/services/util.service';
import { Location } from '@db/entities/owner/location.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { StaffUser } from '@db/entities/staff/user.entity';
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
@UseGuards(StaffAuthGuard())
export class TableController {
  constructor(private pdf: PdfService, private util: UtilService) {}

  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Table}@${PermAct.R}`)
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
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Table}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const table = await Table.findOneByOrFail({ restaurant_id: rest.id, id: param.table_id });
    await response.item(table, TableTransformer);
  }

  @Post()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Table}@${PermAct.C}`)
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
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Table}@${PermAct.U}`)
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
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Table}@${PermAct.U}`)
  async generateLabel(@Body() body, @Res() response, @Me() me: StaffUser, @Rest() restaurant: Restaurant) {
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
          type: PubSubEventType.StaffGetTableLabel,
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
          type: PubSubEventType.StaffGetTableLabel,
          error: error.message,
        });

        Logger.getInstance().notify(error);
      });

    return response.data({ request_id });
  }
}
