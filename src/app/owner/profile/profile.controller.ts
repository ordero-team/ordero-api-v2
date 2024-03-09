import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { AuthService } from '@core/services/auth.service';
import { AwsService } from '@core/services/aws.service';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Media } from '@db/entities/core/media.entity';
import { Location } from '@db/entities/owner/location.entity';
import { Owner, OwnerStatus } from '@db/entities/owner/owner.entity';
import { OwnerTransformer } from '@db/transformers/owner.transformer';
import { NotPermittedException } from '@lib/exceptions/not-permitted.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { time } from '@lib/helpers/time.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { isEmpty } from 'lodash';

@Controller()
@UseGuards(OwnerAuthGuard())
export class ProfileController {
  constructor(private auth: AuthService, private aws: AwsService) {}

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Profile}@${PermAct.R}`)
  async me(@Me() me, @Res() response) {
    return response.item(me, OwnerTransformer);
  }

  @Put()
  @Permissions(`${PermOwner.Staff}@${PermAct.U}`)
  async update(@Param() param, @Body() body, @Res() response, @Me() me: Owner) {
    const rules = {
      name: 'required|safe_text',
      phone: 'required|phone',
      location_id: 'uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    let location: Location = null;
    if (body.location_id) {
      location = await Location.findOneByOrFail({ id: body.location_id });
    }

    me.name = body.name;
    me.phone = body.phone;
    me.location_id = location ? location.id : null;
    await me.save();

    await response.item(me, OwnerTransformer);
  }

  @Post('/resend-code')
  async resendCode(@Body() body, @Res() response, @Me() me: Owner) {
    const exists = await Owner.exists({ where: { id: me.id } });
    if (!exists) {
      throw new BadRequestException(`Invalid Account`);
    }

    if (me.status != OwnerStatus.Verify) {
      throw new NotPermittedException();
    }

    me.verification_code = String(Math.floor(10000 + Math.random() * 90000));
    await me.save();

    await this.auth.sendVerificationEmail(me);

    return response.noContent();
  }

  @Post('/verify')
  async verify(@Body() body, @Res() response, @Me() me: Owner) {
    const rules = {
      code: 'required',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const exists = await Owner.exists({ where: { id: me.id } });
    if (!exists) {
      throw new BadRequestException(`Invalid Account`);
    }

    if (me.status != OwnerStatus.Verify) {
      throw new NotPermittedException();
    }

    if (me.verification_code != body.code) {
      throw new BadRequestException('Invalid Code');
    }

    me.status = OwnerStatus.Active;
    me.verification_code = null;
    me.verified_at = time().toDate();
    await me.save();

    return response.noContent();
  }

  @Post('/avatar')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Profile}@${PermAct.C}`)
  async uploadAvatar(@Req() request, @Res() response, @Me() me: Owner) {
    const file = await this.aws.uploadFile(request, response, 'image', { dynamicPath: `staff/${me.id}/avatar` });
    if (!file || isEmpty(file)) {
      throw new BadRequestException('Unable to upload image');
    }

    if (me.image) {
      await this.aws.removeFile(await me.image);
    }

    await Media.build<Owner>(me, file);

    await response.item(me, OwnerTransformer);
  }

  @Delete('/avatar')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Profile}@${PermAct.D}`)
  async deleteAvatar(@Res() response, @Me() me: Owner) {
    await Media.delete({ owner_id: me.id });
    return response.noContent();
  }
}
