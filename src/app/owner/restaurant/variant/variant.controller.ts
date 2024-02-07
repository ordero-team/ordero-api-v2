import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Variant, VariantStatus } from '@db/entities/owner/variant.entity';
import { VariantTransformer } from '@db/transformers/variant.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class VariantController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Variant}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const variants = await AppDataSource.createQueryBuilder(Variant, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(variants, VariantTransformer);
  }

  @Get('/:variant_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Variant}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const variant = await Variant.findOneByOrFail({ restaurant_id: rest.id, id: param.variant_id });
    await response.item(variant, VariantTransformer);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Variant}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response) {
    const rules = {
      name: 'required|unique|safe_text',
      price: 'required|numeric|min:0',
      status: `required|in:${Object.values(VariantStatus).join(',')}`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const variantExist = await Variant.exists({ where: { name: body.name, restaurant_id: rest.id } });
    if (variantExist) {
      throw new BadRequestException('Variant has already existed.');
    }

    const variant = new Variant();
    variant.name = body.name;
    variant.price = body.price;
    variant.status = body.status;
    variant.restaurant_id = rest.id;
    await variant.save();

    return response.item(variant, VariantTransformer);
  }

  @Put('/:variant_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Variant}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      name: 'required|unique|safe_text',
      price: 'required|numeric|min:0',
      status: `required|in:${Object.values(VariantStatus).join(',')}`,
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.variant_id) {
      throw new BadRequestException();
    }

    const variantExist = await Variant.exists({
      where: { name: body.name, restaurant_id: rest.id, id: Not(param.variant_id) },
    });
    if (variantExist) {
      throw new BadRequestException('Category has already existed.');
    }

    const variant = await Variant.findOneByOrFail({ id: param.variant_id });
    variant.name = body.name;
    variant.price = body.price;
    variant.status = body.status;
    await variant.save();

    return response.item(variant, VariantTransformer);
  }
}
