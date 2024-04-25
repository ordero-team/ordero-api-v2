import { Me } from '@core/decorators/user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';
import { Customer, CustomerStatus } from '@db/entities/core/customer.entity';
import { RawTransformer } from '@db/transformers/raw.transformer';
import { NotPermittedException } from '@lib/exceptions/not-permitted.exception';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { time } from '@lib/helpers/time.helper';
import { Validator } from '@lib/helpers/validator.helper';
import { TwilioOTP } from '@lib/twilio/otp.library';
import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

@Controller()
export class CustomerController {
  @Get('me')
  @UseGuards(AuthGuard())
  async me(@Me() me, @Res() response) {
    return response.item(me, RawTransformer);
  }

  @Post('/me/verify')
  @UseGuards(AuthGuard())
  async verify(@Body() body, @Res() response, @Me() me: Customer) {
    const rules = {
      code: 'required',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (me.status !== CustomerStatus.Verify) {
      throw new NotPermittedException();
    }

    try {
      const otp = new TwilioOTP();
      const isVerified = await otp.verify(me.phone, body.code);

      if (!isVerified) {
        throw new BadRequestException('Invalid OTP. Please try again');
      }

      me.verified_at = time().toDate();
      me.status = CustomerStatus.Active;
      await me.save();

      return response.noContent();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/me/request-otp')
  @UseGuards(AuthGuard())
  async postRequestOTP(@Res() response, @Me() me: Customer) {
    if (me.status !== CustomerStatus.Verify) {
      throw new NotPermittedException();
    }

    try {
      const otp = new TwilioOTP();
      await otp.send(me.phone);

      return response.noContent();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
