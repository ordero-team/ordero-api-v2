import { CustomerService } from '@core/services/customer.service';
import { Customer } from '@db/entities/core/customer.entity';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private custService: CustomerService) {}

  @Post('/register')
  async register(@Body() body, @Res() response) {
    const rules = {
      name: 'required|safe_text',
      phone: 'required|phone',
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

  @Post('/login')
  async login(@Body() body, @Res() response) {
    const rules = {
      phone: 'required|phone',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const customer = await Customer.findOne({ where: { phone: body.phone } });

    if (!customer) {
      throw new BadRequestException('Phone number is not found. Try to sign up');
    }

    const token = await this.custService.login(customer);

    return response.data(token);
  }
}
