import { Quero } from '@core/decorators/quero.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Location } from '@db/entities/owner/location.entity';
import { Owner } from '@db/entities/owner/owner.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { ProductVariant } from '@db/entities/owner/product-variant.entity';
import { ProductStatus } from '@db/entities/owner/product.entity';
import { VariantStatus } from '@db/entities/owner/variant.entity';
import { StockTransformer } from '@db/transformers/stock.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { get } from 'lodash';
import { In } from 'typeorm';

@Controller()
@UseGuards(OwnerAuthGuard())
export class StockController {
  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Stock}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response, @Quero() quero) {
    const query = AppDataSource.createQueryBuilder(ProductStock, 't1').where({ restaurant_id: rest.id });

    if (quero.location_id) {
      query.andWhere({ location_id: quero.location_id });
    }

    const stocks = await query.search().sort().getPaged();
    await response.paginate(stocks, StockTransformer);
  }

  @Get('/:stock_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Stock}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const stock = await ProductStock.findOneByOrFail({ restaurant_id: rest.id, id: param.stock_id });
    await response.item(stock, StockTransformer);
  }

  @Post()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Stock}@${PermAct.C}`)
  async create(@Rest() rest, @Body() body, @Res() response, @Me() me: Owner) {
    const rules = {
      variants: 'required|array',
      location_ids: 'required|array|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const request_id = uuid();

    const progress = async () => {
      const stats = { success: [], fails: [] };

      const variants = await ProductVariant.findBy({ id: In(body.variants.map((val) => val.id)) });
      const locations = await Location.findBy({ id: In(body.location_ids), restaurant_id: rest.id });
      const stocks: ProductStock[] = [];

      for (const variant of variants) {
        for (const location of locations) {
          try {
            const isExist = await ProductStock.exists({ where: { location_id: location.id, variant_id: variant.id } });

            const product = await variant.product;
            const productVar = await variant.variant;
            const variantName = get(productVar, 'name', null);
            if (isExist) {
              stats.fails.push(
                `Product ${product.name} ${variantName ? '- ' + variantName + ' ' : ''}already exist at ${location.name}`
              );

              continue;
            }

            const quantity = body.variants.find((val) => val.id === variant.id);

            const productStock = new ProductStock();
            productStock.product_id = product.id;
            productStock.variant_id = variant.id;
            productStock.location_id = location.id;
            productStock.onhand = get(quantity, 'onhand', 0);
            productStock.restaurant_id = rest.id;
            productStock.last_action = `Added to ${location.name}`;
            productStock.actor = me.logName;
            stocks.push(productStock);

            stats.success.push(
              `Product ${product.name} ${variantName ? '- ' + variantName + ' ' : ''}has been added to ${location.name}`
            );
          } catch (error) {
            stats.fails.push(error.message);
          }
        }
      }

      if (stocks.length > 0) {
        await ProductStock.save(stocks);
      }

      return stats;
    };

    progress()
      .then((stats) => {
        console.log(stats);
      })
      .catch((error) => console.log(error));

    return response.data({ request_id });
  }

  @Put('/:stock_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Stock}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      onhand: 'required|numeric|min:0',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const productStock = await ProductStock.findOneByOrFail({ restaurant_id: rest.id, id: param.stock_id });
    const product = await productStock.product;
    const variant = await productStock.variant;

    // @TODO: How about changing parent stock that affected to their variants stock

    if (variant === null) {
      // Set all product variants to unavailable when parent are 0
      if (Number(body.onhand) <= 0) {
        await ProductStock.update({ product_id: product.id }, { onhand: 0 });
        await ProductVariant.update({ product_id: product.id }, { status: VariantStatus.Unvailable });

        product.status = ProductStatus.Unvailable;
        await product.save();
      }
    } else {
      productStock.onhand = Number(body.onhand);
      await productStock.save();
    }

    await response.item(productStock, StockTransformer);
  }
}
