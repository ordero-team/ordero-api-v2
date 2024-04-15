import { jwt } from '@config/jwt.config';
import { Customer, CustomerStatus } from '@db/entities/core/customer.entity';
import { hashAreEqual } from '@lib/helpers/encrypt.helper';
import { TwilioOTP } from '@lib/twilio/otp.library';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Injectable } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class CustomerService {
  async attempt(username: string, pass: string): Promise<Customer | null> {
    const user = await Customer.findOne({ where: [{ email: username }, { phone: username }] });
    if (user && (await hashAreEqual(user.password, pass))) {
      return user;
    }

    return null;
  }

  async login(user: Customer) {
    // record last login
    // user.last_login_at = time().toDate();
    // await user.save();

    const payload = { phone: user.phone, sub: user.id };
    return {
      access_token: JWT.sign(payload, jwt.secret, jwt.signOptions),
    };
  }

  async register(payload): Promise<Customer> {
    const customer = new Customer();

    await AppDataSource.transaction(async (manager) => {
      // create user
      customer.name = payload.name;
      customer.phone = payload.phone;
      customer.email = payload.email || null;
      customer.status = CustomerStatus.Verify;
      await manager.getRepository(Customer).save(customer);
    });

    // @TODO: Verify if it has email

    const otp = new TwilioOTP();
    await otp.send(customer.phone);

    return customer;
  }
}
