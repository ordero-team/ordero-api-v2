import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { AwsService } from '@core/services/aws.service';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Media } from '@db/entities/core/media.entity';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { RestaurantTransformer } from '@db/transformers/restaurant.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { get, isEmpty } from 'lodash';

@Controller()
@UseGuards(OwnerAuthGuard())
export class RestaurantController {
  constructor(private aws: AwsService) {}

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response) {
    return response.item(rest, RestaurantTransformer);
  }

  @Put()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.U}`)
  async update(@Rest() rest: Restaurant, @Body() body, @Res() response) {
    const rules = {
      name: 'required',
      phone: 'required|phone|unique',
      email: 'email',
      website: 'url',
      description: '',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    rest.name = body.name;
    rest.phone = body.phone;
    rest.email = body.email;
    rest.website = body.website;
    rest.description = body.description;
    await rest.save();

    return response.item(rest, RestaurantTransformer);
  }

  @Post('/image/:type')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.C}`)
  async uploadAvatar(@Req() request, @Res() response, @Rest() rest: Restaurant, @Param() param) {
    if (!['logo', 'banner'].includes(param.type)) {
      throw new BadRequestException('Invalid image type');
    }

    const file = await this.aws.uploadFile(request, response, 'image', { dynamicPath: `restaurant/${rest.id}/avatar` });
    if (!file || isEmpty(file)) {
      throw new BadRequestException('Unable to upload image');
    }

    const payload = await Media.getPayload(file);
    const url = get(payload, 'url', null);
    if (param.type == 'logo') {
      rest.logo_url = url;
    } else if (param.type == 'banner') {
      rest.banner_url = url;
    }

    await AppDataSource.transaction(async (manager) => {
      await manager.getRepository(Restaurant).save(rest);
    });

    await response.item(rest, RestaurantTransformer);
  }

  @Delete('/image/:type')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Restaurant}@${PermAct.D}`)
  async deleteAvatar(@Res() response, @Rest() rest: Restaurant, @Param() param) {
    if (!['logo', 'banner'].includes(param.type)) {
      throw new BadRequestException('Invalid image type');
    }

    if (param.type == 'logo') {
      rest.logo_url = null;
    } else if (param.type == 'banner') {
      rest.banner_url = null;
    }

    await AppDataSource.transaction(async (manager) => {
      await manager.getRepository(Restaurant).save(rest);
    });
    return response.noContent();
  }
}
