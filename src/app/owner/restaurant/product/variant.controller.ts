import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { VariantGroup } from '@db/entities/owner/variant-group.entity';
import { Variant } from '@db/entities/owner/variant.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

@Controller(':product_id/variants')
@UseGuards(OwnerAuthGuard())
export class VariantController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.R}`)
  async getVariants(@Rest() rest, @Res() response, @Param() param) {
    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const productVariants = await ProductVariant.findBy({ product_id: product.id });
    const variants = await Variant.find({
      where: { id: In(productVariants.map((val) => val.variant_id)) },
      order: { price: 'ASC' },
    });
    const groups = await VariantGroup.find({
      where: { id: In(variants.map((val) => val.group_id)) },
      order: { name: 'ASC' },
    });

    const result: any[] = [];

    for (const group of groups) {
      const payload = {
        ...group,
        variants: [],
      };

      for (const variant of variants) {
        if (variant.group_id === group.id) {
          payload.variants.push(variant);
        }
      }

      result.push(payload);
    }

    return response.data(result);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.U}`)
  async addVariant(@Body() body, @Res() response, @Param() param, @Rest() rest) {
    const rules = {
      variant_ids: 'required|array',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const prodVariants: ProductVariant[] = [];

    const variants = await Variant.findBy({ id: In(body.variant_ids) });
    for (const variant of variants) {
      const isExist = await ProductVariant.exists({ where: { product_id: product.id, variant_id: variant.id } });
      if (isExist) {
        continue;
      }

      const pcat = new ProductVariant();
      pcat.product_id = product.id;
      pcat.variant_id = variant.id;
      pcat.status = variant.status;
      pcat.price = variant.price;
      pcat.restaurant_id = rest.id;
      prodVariants.push(pcat);
    }

    if (prodVariants.length > 0) {
      await ProductVariant.save(prodVariants);
    }

    await response.item(product, ProductTransformer);
  }

  @Delete('/:variant_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.D}`)
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
