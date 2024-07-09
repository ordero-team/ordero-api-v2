import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { PermAct, PermStaff } from '@core/services/role.service';
import { Category } from '@db/entities/owner/category.entity';
import { CategoryTransformer } from '@db/transformers/category.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller()
@UseGuards(StaffAuthGuard())
export class CategoryController {
  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Category}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const categories = await AppDataSource.createQueryBuilder(Category, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(categories, CategoryTransformer);
  }

  @Get('/:category_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Category}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const category = await Category.findOneByOrFail({ restaurant_id: rest.id, id: param.category_id });
    await response.item(category, CategoryTransformer);
  }

  @Post()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Category}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response) {
    const rules = {
      name: 'required|unique|safe_text',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const categoryExist = await Category.exists({ where: { name: body.name, restaurant_id: rest.id } });
    if (categoryExist) {
      throw new BadRequestException('Category has already existed.');
    }

    const categ = new Category();
    categ.name = body.name;
    categ.restaurant_id = rest.id;
    await categ.save();

    return response.item(categ, CategoryTransformer);
  }

  @Put('/:category_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Category}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      name: 'required|unique|safe_text',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.category_id) {
      throw new BadRequestException();
    }

    const categoryExist = await Category.exists({
      where: { name: body.name, restaurant_id: rest.id, id: Not(param.category_id) },
    });
    if (categoryExist) {
      throw new BadRequestException('Category has already existed.');
    }

    const categ = await Category.findOneByOrFail({ id: param.category_id });
    categ.name = body.name;
    await categ.save();

    return response.item(categ, CategoryTransformer);
  }
}
