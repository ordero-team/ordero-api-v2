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
import { Product, ProductStatus } from '@db/entities/owner/product.entity';
import { VariantStatus } from '@db/entities/owner/variant.entity';
import { StockTransformer } from '@db/transformers/stock.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import Socket, { PubSubEventType, PubSubPayloadType, PubSubStatus } from '@lib/pubsub/pubsub.lib';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { get } from 'lodash';
import { In, IsNull } from 'typeorm';

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
      products: 'required|array',
      location_ids: 'required|array|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const request_id = uuid();

    const progress = async () => {
      const stats = { success: [], fails: [] };

      try {
        const items = await Product.findBy({ id: In(body.products.map((val) => val.id)), restaurant_id: rest.id });

        if (!items.length) {
          throw new BadRequestException(`There is no products found`);
        }

        const locations = await Location.findBy({ id: In(body.location_ids), restaurant_id: rest.id });

        if (!locations.length) {
          throw new BadRequestException(`There is no locations found`);
        }

        const stocks: ProductStock[] = [];

        for (const item of body.products) {
          const product = items.find((val) => val.id === item.id);

          const where = { product_id: product.id };

          if (item.variant_id) {
            Object.assign(where, { ...where, variant_id: item.variant_id });
          }

          const productVariant = await ProductVariant.findOneBy(where);

          if (!productVariant) {
            throw new NotFoundException(`Can't found ${product.sku} match with ID Variant ${item.variant_id}`);
          }

          for (const location of locations) {
            try {
              const isExist = await ProductStock.exists({
                where: { location_id: location.id, product_id: product.id, variant_id: productVariant.id },
              });

              const productFullName = await productVariant.getFullName();

              if (product.status == ProductStatus.Discontinued) {
                throw new BadRequestException(`Can't add initial stock, ${productFullName} status is discontinued`);
              }

              if (isExist) {
                throw new BadRequestException(`Product ${productFullName} already exist at ${location.name}`);
              }

              // Count Product Variants (to check if it has parent, so it should be skipped)
              const countVariant = await ProductVariant.count({ where: { product_id: product.id } });
              if (countVariant > 1) {
                const check = await ProductVariant.exists({ where: { id: productVariant.id, variant_id: IsNull() } });
                if (check) {
                  // Skip if it's a Parent
                  throw new BadRequestException(
                    `Product ${productFullName} are skipped because it has variants. Please choose the variant.`
                  );
                }
              }

              const quantity = body.products.find((val) => val.id === product.id);

              const action = `Initial Stock: ${productFullName} at ${location.name}`;
              const productStock = new ProductStock();
              productStock.product_id = productVariant.product_id;
              productStock.variant_id = productVariant.id;
              productStock.location_id = location.id;
              productStock.onhand = get(quantity, 'qty', 0);
              productStock.restaurant_id = rest.id;
              productStock.last_action = action;
              productStock.actor = me.logName;
              stocks.push(productStock);

              stats.success.push(`Product ${productFullName} has been added to ${location.name}`);
            } catch (error) {
              stats.fails.push(error.message);
            }
          }
        }

        await AppDataSource.transaction(async (manager) => {
          for (const stock of stocks) {
            await manager.getRepository(ProductStock).save(stock);
          }
        });
      } catch (error) {
        stats.fails.push(error.message);
      }

      return stats;
    };

    progress()
      .then(({ success, fails }) => {
        const payload = [...fails, ...success];

        Socket.getInstance().event(me.id, {
          request_id,
          status: fails.length > 0 || !success.length ? PubSubStatus.Warning : PubSubStatus.Success,
          type: PubSubEventType.OwnerCreateStock,
          payload: {
            type: PubSubPayloadType.Dialog,
            body: payload.length > 50 ? [...payload.slice(0, 50), 'and more...'] : payload,
          },
        });
      })
      .catch((error) => {
        Socket.getInstance()
          .event(me.id, {
            request_id,
            status: PubSubStatus.Fail,
            type: PubSubEventType.OwnerCreateStock,
            error: error.message,
          })
          .catch((error) => console.log(error));
      });

    return response.data({ request_id });
  }

  @Put('/:stock_id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Stock}@${PermAct.U}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param, @Me() me: Owner) {
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

    if (Number(body.onhand) < productStock.allocated) {
      throw new Error('The onhand quantity cannot be lower than the allocated quantity.');
    }

    if (variant === null) {
      // Set all product variants to unavailable when parent are 0
      if (Number(body.onhand) <= 0) {
        await AppDataSource.transaction(async (manager) => {
          productStock.onhand = 0;
          productStock.last_action = `Update Stock`;
          productStock.actor = me.logName;
          await manager.getRepository(ProductStock).save(productStock);

          variant.status = VariantStatus.Unvailable;
          await manager.getRepository(ProductVariant).save(variant);

          product.status = ProductStatus.Unvailable;
          await manager.getRepository(Product).save(product);
        });
      }
    } else {
      await AppDataSource.transaction(async (manager) => {
        productStock.onhand = Number(body.onhand);
        productStock.last_action = `Update Stock`;
        productStock.actor = me.logName;
        await manager.getRepository(ProductStock).save(productStock);

        variant.status = VariantStatus.Available;
        await manager.getRepository(ProductVariant).save(variant);

        product.status = ProductStatus.Available;
        await manager.getRepository(Product).save(product);
      });
    }

    await response.item(productStock, StockTransformer);
  }
}
