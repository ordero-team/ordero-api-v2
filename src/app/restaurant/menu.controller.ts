import { Product } from '@db/entities/owner/product.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('restaurants/:restaurant_id/menus')
export class MenuController {
  @Get()
  async getMenus(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    const menus = await AppDataSource.createQueryBuilder(Product, 't1')
      .where({ restaurant_id: restaurant.id })
      .search()
      .sort()
      .getPaged();
    await response.paginate(menus, ProductTransformer);
  }

  @Get(':menu_id')
  async getMenu(@Res() response, @Param() params) {
    const restaurant = await Restaurant.findOneByOrFail({ id: params.restaurant_id });
    const menu = await Product.findOneOrFail({ where: { id: params.menu_id, restaurant_id: restaurant.id } });
    await response.item(menu, ProductTransformer);
  }
}
