import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { Product } from '@db/entities/owner/product.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { Table } from '@db/entities/owner/table.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller(':restaurant_id/menus')
export class MenuController {
  @Get()
  async getMenus(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });

    let table: Table = null;

    const menus = AppDataSource.createQueryBuilder(Product, 't1')
      .leftJoin(ProductVariant, 't2', 't2.product_id = t1.id')
      .leftJoin(ProductStock, 't3', 't3.variant_id = t2.id')
      .where('t1.restaurant_id = :restId', { restId: restaurant.id });

    if (params.table_id) {
      table = await Table.findOneBy({ id: params.table_id });

      if (table) {
        menus.andWhere('t3.location_id = :locId', { locId: table.location_id });
      }
    }

    const results = await menus.search().sort().getPaged();
    await response.paginate(results, ProductTransformer);
  }

  @Get(':menu_id')
  async getMenu(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    const menu = await Product.findOneOrFail({ where: { id: params.menu_id, restaurant_id: restaurant.id } });
    await response.item(menu, ProductTransformer);
  }
}
