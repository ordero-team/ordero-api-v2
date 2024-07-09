import { Category } from '@db/entities/owner/category.entity';
import { ProductCategory } from '@db/entities/owner/product-category.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { VariantGroup } from '@db/entities/owner/variant-group.entity';
import { Variant, VariantStatus } from '@db/entities/owner/variant.entity';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class ProductService {
  async create(rest: Restaurant, body: any): Promise<Product> {
    try {
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
        pvar.restaurant_id = rest.id;
        pvars.push(pvar);

        // Save Variants
        if (variants.length > 0) {
          for (const variant of variants) {
            const vari = new ProductVariant();
            vari.status = variant.status;
            vari.product_id = prod.id;
            vari.variant_id = variant.id;
            vari.price = variant.price;
            vari.restaurant_id = rest.id;
            pvars.push(vari);
          }
        }

        await manager.getRepository(ProductVariant).save(pvars);

        // @TODO: Create Product History
      });

      return prod;
    } catch (error) {
      throw error;
    }
  }

  async assignCategories(rest: Restaurant, id: string, category_ids: string[]): Promise<Product> {
    try {
      const product = await Product.findOrFail({ where: { id, restaurant_id: rest.id } });
      const prodCategories: ProductCategory[] = [];

      const categories = await Category.findBy({ id: In(category_ids) });
      for (const category of categories) {
        const isExist = await ProductCategory.exists({ where: { product_id: product.id, category_id: category.id } });
        if (isExist) {
          continue;
        }

        const pcat = new ProductCategory();
        pcat.product_id = product.id;
        pcat.category_id = category.id;
        prodCategories.push(pcat);
      }

      if (prodCategories.length > 0) {
        await ProductCategory.save(prodCategories);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  async assignVariant(rest: Restaurant, id: string, variant_ids: string[]): Promise<Product> {
    try {
      const product = await Product.findOrFail({ where: { id, restaurant_id: rest.id } });
      const prodVariants: ProductVariant[] = [];

      const variants = await Variant.findBy({ id: In(variant_ids) });
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
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getVariants(id: string, rest: Restaurant): Promise<any[]> {
    const product = await Product.findOrFail({ where: { id, restaurant_id: rest.id } });
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
    return result;
  }
}
