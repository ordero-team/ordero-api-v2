import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Category } from '@db/entities/owner/category.entity';
import { ProductCategory } from '@db/entities/owner/product-category.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product, ProductStatus } from '@db/entities/owner/product.entity';
import { Variant, VariantStatus } from '@db/entities/owner/variant.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { In } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class ProductController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Product}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    const products = await AppDataSource.createQueryBuilder(Product, 't1')
      .where({ restaurant_id: rest.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(products, ProductTransformer);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Category}@${PermAct.C}`)
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

    const prod = new Product();
    prod.sku = body.sku;
    prod.name = body.name;
    prod.description = body.description;
    prod.price = body.price;
    prod.status = body.status;
    prod.restaurant_id = rest.id;

    let categories: Category[] = [];
    let variants: Variant[] = [];

    if (body.category_ids.length > 0) {
      categories = await Category.find({ where: { id: In(body.category_ids), restaurant_id: rest.id } });
    }

    if (body.variant_ids.length > 0) {
      variants = await Variant.find({ where: { id: In(body.variant_ids), restaurant_id: rest.id } });
    }

    await AppDataSource.transaction(async (manager) => {
      // Save Product
      await manager.getRepository(Product).save(prod);

      // Save Category
      if (categories.length > 0) {
        const pcats: ProductCategory[] = [];
        for (const category of categories) {
          const pcat = new ProductCategory();
          pcat.product_id = prod.id;
          pcat.category_id = category.id;
          pcats.push(pcat);
        }

        await manager.getRepository(ProductCategory).save(pcats);
      }

      const pvars: ProductVariant[] = [];

      // Create default variant for single product
      const pvar = new ProductVariant();
      pvar.product_id = prod.id;
      pvar.price = prod.price;
      pvar.status = VariantStatus.Available;
      pvars.push(pvar);

      // Save Variants
      if (variants.length > 0) {
        for (const variant of variants) {
          const pvar = new ProductVariant();
          pvar.status = variant.status;
          pvar.product_id = prod.id;
          pvar.variant_id = variant.id;
          pvar.price = variant.price;
        }
      }

      await manager.getRepository(ProductVariant).save(pvars);
    });

    return response.item(prod, ProductTransformer);
  }
}
