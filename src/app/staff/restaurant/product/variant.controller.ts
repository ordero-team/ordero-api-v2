import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { ProductService } from '@core/services/product.service';
import { PermAct, PermStaff } from '@core/services/role.service';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';

@Controller(':product_id/variants')
@UseGuards(StaffAuthGuard())
export class VariantController {
  constructor(private productService: ProductService) {}

  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.R}`)
  async getVariants(@Rest() rest, @Res() response, @Param() param) {
    const result = await this.productService.getVariants(param.product_id, rest);
    return response.data(result);
  }

  @Post()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.U}`)
  async addVariant(@Body() body, @Res() response, @Param() param, @Rest() rest) {
    const rules = {
      variant_ids: 'required|array',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const product = await this.productService.assignVariant(rest, param.product_id, body.variant_ids);

    await response.item(product, ProductTransformer);
  }

  @Delete('/:variant_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.D}`)
  async deleteVariant(@Param() param, @Res() response, @Rest() rest) {
    if (!param.variant_id) {
      throw new BadRequestException();
    }

    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const variant = await ProductVariant.findOneByOrFail({ id: param.variant_id, product_id: product.id });

    await variant.remove();

    return response.noContent();
  }
}
