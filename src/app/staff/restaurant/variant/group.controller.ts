import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PermAct, PermStaff } from '@core/services/role.service';
import { VariantGroup, VariantGroupType } from '@db/entities/owner/variant-group.entity';
import { VariantGroupTransformer } from '@db/transformers/variant-group.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { isTrue } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller('groups')
@UseGuards(StaffAuthGuard())
export class VariantGroupController {
  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Variant}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const groups = await AppDataSource.createQueryBuilder(VariantGroup, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(groups, VariantGroupTransformer);
  }

  @Get('/:group_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Variant}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const group = await VariantGroup.findOneByOrFail({ restaurant_id: rest.id, id: param.group_id });
    await response.item(group, VariantGroupTransformer);
  }

  @Post()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Variant}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response) {
    const rules = {
      name: 'required|unique|safe_text',
      type: `required|in:${Object.values(VariantGroupType).join(',')}`,
      required: 'required|boolean',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const groupExist = await VariantGroup.exists({ where: { name: body.name, restaurant_id: rest.id } });
    if (groupExist) {
      throw new BadRequestException('Variant Group has already existed.');
    }

    const group = new VariantGroup();
    group.name = body.name;
    group.type = body.type;
    group.required = isTrue(body.required);
    group.restaurant_id = rest.id;
    await group.save();

    return response.item(group, VariantGroupTransformer);
  }

  @Put('/:group_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Variant}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      name: 'required|unique|safe_text',
      type: `required|in:${Object.values(VariantGroupType).join(',')}`,
      required: 'required|boolean',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.group_id) {
      throw new BadRequestException();
    }

    const groupExist = await VariantGroup.exists({
      where: { name: body.name, restaurant_id: rest.id, id: Not(param.group_id) },
    });
    if (groupExist) {
      throw new BadRequestException('Variant Group has already existed.');
    }

    const group = await VariantGroup.findOneByOrFail({ id: param.group_id });
    group.name = body.name;
    group.type = body.type;
    group.required = isTrue(body.required);
    await group.save();

    return response.item(group, VariantGroupTransformer);
  }
}
