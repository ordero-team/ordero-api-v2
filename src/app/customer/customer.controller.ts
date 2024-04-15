import { Me } from '@core/decorators/user.decorator';
import { AuthGuard } from '@core/guards/auth.guard';
import { CustomerService } from '@core/services/customer.service';
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
  constructor(private custService: CustomerService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  async me(@Me() me, @Res() response) {
    return response.item(me, RawTransformer);
  }

  @Post('/register')
  async register(@Body() body, @Res() response) {
    const rules = {
      name: 'required|safe_text',
      phone: 'required|phone|unique',
      email: 'email',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const isExist = await Customer.exists({ where: [{ phone: body.phone }, { email: body.email }] });

    if (isExist) {
      throw new BadRequestException('Phone number is already exist. Try to sign in');
    }

    const customer = await this.custService.register(body);
    const token = await this.custService.login(customer);

    return response.data(token);
  }

  @Post('/verify')
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

  @Post('/request-otp')
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
