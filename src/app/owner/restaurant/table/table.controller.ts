import { Quero } from '@core/decorators/quero.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Location } from '@db/entities/owner/location.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { TableTransformer } from '@db/transformers/table.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class TableController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Table}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response, @Quero() quero) {
    const tables = AppDataSource.createQueryBuilder(Table, 't1');
    tables.where({ restaurant_id: rest.id });

    if (quero.location_id) {
      tables.andWhere({ location_id: quero.location_id });
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
  @Permissions(`${PermOwner.Location}@${PermAct.U}`)
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
}
