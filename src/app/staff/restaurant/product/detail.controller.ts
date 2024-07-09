import { Quero } from '@core/decorators/quero.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { StaffAuthGuard } from '@core/guards/auth.guard';
import { StaffGuard } from '@core/guards/staff.guard';
import { AwsService } from '@core/services/aws.service';
import { PermAct, PermStaff } from '@core/services/role.service';
import { Media } from '@db/entities/core/media.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { Product } from '@db/entities/owner/product.entity';
import { ProductTransformer } from '@db/transformers/product.transformer';
import { StockTransformer } from '@db/transformers/stock.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Not } from 'typeorm';

@Controller(':product_id')
@UseGuards(StaffAuthGuard())
export class DetailController {
  constructor(private aws: AwsService) {}

  @Get()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const product = await Product.findOneByOrFail({ restaurant_id: rest.id, id: param.product_id });
    await response.item(product, ProductTransformer);
  }

  @Put()
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.C}`)
  async update(@Rest() rest, @Body() body, @Res() response, @Param() param) {
    const rules = {
      sku: 'required|sku',
      name: 'required|string',
      description: 'string',
      price: 'required|numeric|min:0',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!param.product_id) {
      throw new BadRequestException();
    }

    const productExist = await Product.exists({
      where: { sku: body.sku, restaurant_id: rest.id, id: Not(param.product_id) },
    });
    if (productExist) {
      throw new BadRequestException('Product has already existed.');
    }

    const product = await Product.findOneByOrFail({ id: param.product_id });
    product.sku = body.sku;
    product.name = body.name;
    product.description = body.decription;
    product.price = body.price;
    await product.save();

    return response.item(product, ProductTransformer);
  }

  @Post('/images')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.U}`)
  async uploadImage(@Param() param, @Req() request, @Res() response, @Rest() rest) {
    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    if ((await Media.total(product)) >= 5) {
      throw new BadRequestException('Maximum total image allowed is 5');
    }

    const file = await this.aws.uploadFile(request, response, 'image', {
      dynamicPath: `restaurants/${rest.id}/products`,
    });

    await Media.add<Product>(product, file);

    await response.item(product, ProductTransformer);
  }

  @Delete('/images/:image_id')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.D}`)
  async deleteImage(@Param() param, @Res() response, @Rest() rest) {
    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const media = await Media.findOrFail({ where: { id: param.image_id, product_id: product.id } });

    await this.aws.removeFile(media);

    return response.noContent();
  }

  @Get('/stocks')
  @UseGuards(StaffGuard)
  @Permissions(`${PermStaff.Product}@${PermAct.R}`)
  async getStocks(@Param() param, @Res() response, @Rest() rest, @Quero() quero) {
    if (!param.product_id) {
      throw new BadRequestException();
    }

    const product = await Product.findOrFail({ where: { id: param.product_id, restaurant_id: rest.id } });
    const where = { product_id: product.id };

    if (quero.location_id) {
      Object.assign(where, { ...where, location_id: quero.location_id });
    }

    const stocks = await ProductStock.findBy(where);

    return response.collection(stocks, StockTransformer);
  }
}
