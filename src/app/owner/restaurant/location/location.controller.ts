import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Location } from '@db/entities/owner/location.entity';
import { LocationTransformer } from '@db/transformers/location.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { isTrue } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class LocationController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Location}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const locations = await AppDataSource.createQueryBuilder(Location, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(locations, LocationTransformer);
  }

  @Get('/:location_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Location}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const location = await Location.findOneByOrFail({ restaurant_id: rest.id, id: param.location_id });
    await response.item(location, LocationTransformer);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Location}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response) {
    const rules = {
      name: 'required|unique|safe_text',
      address: 'required',
      is_default: 'boolean',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const locationExist = await Location.exists({ where: { name: body.name, restaurant_id: rest.id } });
    if (locationExist) {
      throw new BadRequestException('Location has already existed.');
    }

    const loc = new Location();
    loc.name = body.name;
    loc.address = body.address;
    loc.is_default = isTrue(body.is_default);
    loc.restaurant_id = rest.id;
    await loc.save();

    return response.item(loc, LocationTransformer);
  }

  @Put('/:location_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Location}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      name: 'required|unique|safe_text',
      address: 'required',
      is_default: 'boolean',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.location_id) {
      throw new BadRequestException();
    }

    const locationExist = await Location.exists({
      where: { name: body.name, restaurant_id: rest.id, id: Not(param.location_id) },
    });
    if (locationExist) {
      throw new BadRequestException('Location has already existed.');
    }

    if (isTrue(body.is_default)) {
      await Location.update({ restaurant_id: rest.id }, { is_default: !isTrue(body.is_default) });
    }

    const loc = await Location.findOneByOrFail({ id: param.location_id });
    loc.name = body.name;
    loc.address = body.address;
    loc.is_default = isTrue(body.is_default);
    await loc.save();

    return response.item(loc, LocationTransformer);
  }
}
