import { Loc } from '@core/decorators/location.decorator';
import { Rest } from '@core/decorators/restaurant.decorator';
import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { OwnerGuard } from '@core/guards/owner.guard';
import { PermAct, PermOwner } from '@core/services/role.service';
import { Location } from '@db/entities/owner/location.entity';
import { StaffRole } from '@db/entities/staff/role.entity';
import { StaffUser, StaffUserStatus } from '@db/entities/staff/user.entity';
import { StaffTransformer } from '@db/transformers/staff.transformer';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { hash } from '@lib/helpers/encrypt.helper';
import { randomChar } from '@lib/helpers/utils.helper';
import { Validator } from '@lib/helpers/validator.helper';
import Logger from '@lib/logger/logger.library';
import { Permissions } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(OwnerAuthGuard())
export class StaffController {
  constructor(private mail: MailerService) {}

  @Get()
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Staff}@${PermAct.R}`)
  async index(@Rest() rest, @Res() response, @Loc() loc: Location) {
    const query = AppDataSource.createQueryBuilder(StaffUser, 't1');
    query.where({ restaurant_id: rest.id });

    if (loc.id) {
      query.andWhere({ location_id: loc.id });
    }

    const staffs = await query.search().sort().getPaged();
    await response.paginate(staffs, StaffTransformer);
  }

  @Get('/:id')
  @UseGuards(OwnerGuard)
  @Permissions(`${PermOwner.Staff}@${PermAct.R}`)
  async show(@Rest() rest, @Res() response, @Param() param) {
    const staff = await StaffUser.findOrFailByRestaurant(param.id, rest);
    await response.item(staff, StaffTransformer);
  }

  @Post()
  @Permissions(`${PermOwner.Staff}@${PermAct.C}`)
  async store(@Body() body, @Res() response, @Rest() rest) {
    const rules = {
      name: 'required|safe_text',
      email: 'required|email',
      phone: 'required|phone',
      role_id: 'required|uid',
      location_id: 'required|uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    if (!rest) {
      throw new BadRequestException('You must be assigned to a restaurant');
    }

    const emailExists = await StaffUser.exists({ where: { email: body.email } });
    if (emailExists) {
      throw new BadRequestException('Email has already been used');
    }

    const phoneExists = await StaffUser.exists({ where: { phone: body.phone } });
    if (phoneExists) {
      throw new BadRequestException('Phone has already been used');
    }

    const role = await StaffRole.findOneByOrFail({ id: body.role_id });

    let location: Location = null;
    if (body.location_id) {
      location = await Location.findOneByOrFail({ id: body.location_id });
    }

    const plainPass = randomChar(8);
    const staff = new StaffUser();
    staff.name = body.name;
    staff.email = String(body.email).toLowerCase();
    staff.phone = body.phone;
    staff.password = await hash(plainPass);
    staff.status = StaffUserStatus.Active;
    staff.role_slug = role.slug;
    staff.location_id = location ? location.id : null;
    staff.restaurant_id = rest.id;
    await staff.save();

    this.mail
      .sendMail({
        to: staff.email,
        subject: 'Your staff account!',
        template: 'staff-register',
        context: {
          name: staff.name,
          password: plainPass,
        },
      })
      .then(() => null)
      .catch((error) => Logger.getInstance().notify(error));

    await response.item(staff, StaffTransformer);
  }

  @Put('/:id')
  @Permissions(`${PermOwner.Staff}@${PermAct.U}`)
  async update(@Param() param, @Body() body, @Res() response) {
    const rules = {
      name: 'required|safe_text',
      phone: 'required|phone',
      status: `required|in:${Object.values(StaffUserStatus).join(',')}`,
      role_id: 'required|uid',
      location_id: 'uid',
    };
    const validation = Validator.init(body, rules);
    if (validation.fails()) {
      throw new ValidationException(validation);
    }

    const role = await StaffRole.findOneByOrFail({ id: body.role_id });

    let location: Location = null;
    if (body.location_id) {
      location = await Location.findOneByOrFail({ id: body.location_id });
    }

    const staff = await StaffUser.findOneByOrFail({ id: param.id });

    staff.name = body.name;
    staff.phone = body.phone;
    staff.status = body.status;
    staff.role_slug = role.slug;
    staff.location_id = location ? location.id : null;
    await staff.save();

    await response.item(staff, StaffTransformer);
  }
}
