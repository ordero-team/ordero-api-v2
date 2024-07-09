import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { ProductService } from '@core/services/product.service';
import { PermAct, PermOwner } from '@core/services/role.service';
import { ProductCategory } from '@db/entities/owner/product-category.entity';
import { Product } from '@db/entities/owner/product.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Delete, Param, Post, Res, UseGuards } from '@nestjs/common';

@Controller(':product_id')
@UseGuards(OwnerAuthGuard())
export class CategoryController {
  constructor(private productService: ProductService) {}

  @Post('/categories')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.U}`)
  async addCategory(@Body() body, @Res() response, @Param() param, @Rest() rest) {
    const rules = {
      category_ids: 'required|array|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const product = await this.productService.assignCategories(rest, param.product_id, body.category_ids);

    await response.item(product, ProductTransformer);
  }

  @Delete('/categories/:category_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.D}`)
  async deleteCategory(@Param() param, @Res() response, @Rest() rest) {
    if (!param.category_id) {
      throw new BadRequestException();
    }

    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const category = await ProductCategory.findOneByOrFail({ id: param.category_id, product_id: product.id });

    await category.remove();

    return response.noContent();
  }
}
