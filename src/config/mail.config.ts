import { config } from '@lib/helpers/config.helper';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

export const mail: MailerOptions = {
  transport: {
    host: config.get('SMTP_HOST'),
    port: Number(config.get('SMTP_PORT')),
    secure: false,
    auth: {
      user: config.get('MAIL_USERNAME'),
      pass: config.get('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: config.get('MAIL_FROM'),
  },
  template: {
    dir: config.getRootPath() + '/templates/mails',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: false,
    },
  },
};
