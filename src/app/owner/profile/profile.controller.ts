import { Me } from '@core/decorators/user.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { AuthService } from '@core/services/auth.service';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Owner, OwnerStatus } from '@db/entities/owner/owner.entity';
import { OwnerTransformer } from '@db/transformers/owner.transformer';
import { NotPermittedException } from '@lib/exceptions/not-permitted.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { time } from '@lib/helpers/time.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { Permissions } from '@lib/rbac';
import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(OwnerAuthGuard())
export class ProfileController {
  constructor(private auth: AuthService) {}

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Profile}@${PermAct.R}`)
  async me(@Me() me, @Res() response) {
    return response.item(me, OwnerTransformer);
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
}
