import { Restaurant, RestaurantStatus } from '@db/entities/owner/restaurant.entity';
import { Table } from '@db/entities/owner/table.entity';
import { TableTransformer } from '@db/transformers/table.transformer';

import { GenericException } from '@lib/exceptions/generic.exception';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { get } from 'lodash';

@Controller()
export class TableController {
  @Get('/:id')
  async checkTable(@Param() params, @Res() response) {
    const id = get(params, 'id', null);
    const table = await Table.findOneBy({ id });

    if (!table) {
      throw new NotFoundException('Table not found!');
    }

    const restaurant = await Restaurant.findOneBy({ id: table.restaurant_id });

    if (restaurant.status !== RestaurantStatus.Active) {
      throw new GenericException(`Sorry, restaurant is inactive`);
    }

    return response.item(table, TableTransformer);
  }
}
