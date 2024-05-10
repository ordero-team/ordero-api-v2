import { Restaurant, RestaurantStatus } from '@db/entities/owner/restaurant.entity';
import { Table, TableStatus } from '@db/entities/owner/table.entity';
import { TableTransformer } from '@db/transformers/table.transformer';

import { GenericException } from '@lib/exceptions/generic.exception';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { capitalize, get } from 'lodash';

@Controller('tables')
export class TableController {
  @Get('/:id')
  async checkTable(@Param() params, @Res() response) {
    const id = get(params, 'id', null);
    const table = await Table.findOneBy({ id });

    if (!table) {
      throw new NotFoundException('Table not found!');
    }

    if (table.status !== TableStatus.Available) {
      throw new GenericException(`Can't use Table ${table.number}, because it's ${capitalize(table.status)}`);
    }

    const restaurant = await Restaurant.findOneBy({ id: table.restaurant_id });

    if (restaurant.status !== RestaurantStatus.Active) {
      throw new GenericException(`Sorry, restaurant is inactive`);
    }

    return response.item(table, TableTransformer);
  }
}
