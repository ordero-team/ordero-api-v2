import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { ProductService } from '@core/services/product.service';
import { PermAct, PermStaff } from '@core/services/role.service';
import { Product, ProductStatus } from '@db/entities/owner/product.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(StaffAuthGuard())
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const products = await AppDataSource.createQueryBuilder(Product, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(products, ProductTransformer);
  }

  @Post()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response) {
    const rules = {
      sku: 'required|sku',
      name: 'required|string',
      description: 'string',
      price: 'required|numeric|min:0',
      status: `required|in:${Object.values(ProductStatus).join(',')}`,
      category_ids: 'array|unique|uid',
      variant_ids: 'array|unique|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const productExist = await Product.exists({ where: { sku: body.sku, restaurant_id: rest.id } });
    if (productExist) {
      throw new BadRequestException('Product SKU has already existed.');
    }

    const prod = await this.productService.create(rest, body);

    return response.item(prod, ProductTransformer);
  }
}
