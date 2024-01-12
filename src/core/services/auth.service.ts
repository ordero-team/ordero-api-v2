import { jwt } from '@config/jwt.config';
import { Role } from '@db/entities/core/role.entity';
import { Owner, OwnerStatus } from '@db/entities/owner/owner.entity';
import { Restaurant, RestaurantStatus } from '@db/entities/owner/restaurant.entity';
import { config } from '@lib/helpers/config.helper';
import { hash, hashAreEqual } from '@lib/helpers/encrypt.helper';
import Logger from '@lib/logger/logger.library';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { uuid } from '@lib/uid/uuid.library';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private mail: MailerService) {}

  async attempt(username: string, pass: string): Promise<Owner | null> {
    const user = await Owner.findOne({ where: [{ email: username }, { phone: username }] });
    if (user && (await hashAreEqual(user.password, pass))) {
      return user;
    }

    return null;
  }

  async login(user: Owner) {
    // record last login
    // user.last_login_at = time().toDate();
    // await user.save();

    const payload = { email: user.email, phone: user.phone, sub: user.id };
    return {
      access_token: JWT.sign(payload, jwt.secret, jwt.signOptions),
      pubsub_token: JWT.sign(payload, config.get('CENTRIFUGO_SECRET')),
    };
  }

  async register(payload): Promise<Owner> {
    const user = new Owner();
    const slug = await Restaurant.slug(payload.restaurant);

    // get owner role
    const role = await Role.findBySlug('owner');
    if (!role) {
      throw new NotFoundException('Role owner is not found');
    }

    await AppDataSource.transaction(async (manager) => {
      // create user
      user.email = String(payload.email).toLowerCase();
      user.password = await hash(payload.password);
      user.name = payload.name;
      user.phone = payload.phone;
      user.verification_code = String(Math.floor(10000 + Math.random() * 90000));
      user.status = OwnerStatus.Verify;
      user.role_slug = role.slug;
      await manager.getRepository(Owner).save(user);

      // create company
      const restaurant = new Restaurant();
      restaurant.name = payload.name;
      restaurant.slug = slug;
      restaurant.owner_id = user.id;
      restaurant.status = RestaurantStatus.Active;
      await manager.getRepository(Restaurant).save(restaurant);

      user.restaurant_id = restaurant.id;
      await manager.getRepository(Owner).save(user);
    });

    await this.sendVerificationEmail(user);

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendVerificationEmail(user: Owner, changeEmail = false): Promise<void> {
    this.mail
      .sendMail({
        to: user.email,
        subject: 'Verify Your Account',
        template: 'register',
        context: {
          name: user.name,
          code: user.verification_code,
        },
      })
      .then(() => null)
      .catch((error) => Logger.getInstance().notify(error));
  }

  async forgotPassword(user: Owner): Promise<void> {
    user.reset_token = uuid();
    // user.reset_token_expires = time().add(24, 'hour').toDate();
    await user.save();

    // this.mail
    //   .sendMail({
    //     to: user.email,
    //     subject: 'Set up a new password',
    //     template: 'change-password',
    //     context: {
    //       name: user.name,
    //       link: `${config.get('APP_URI')}/reset-password/${user.reset_token}`,
    //     },
    //   })
    //   .then(() => null)
    //   .catch((error) => Logger.getInstance().notify(error));
  }

  async changePassword(user: Owner, password: string): Promise<void> {
    user.password = await hash(password);
    user.reset_token = null;
    // user.reset_token_expires = null;
    await user.save();

    // this.mail
    //   .sendMail({
    //     to: user.email,
    //     subject: 'Changed password',
    //     template: 'changed-password',
    //     context: {
    //       name: user.name,
    //     },
    //   })
    //   .then(() => null)
    //   .catch((error) => Logger.getInstance().notify(error));
  }
}
