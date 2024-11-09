import { config } from '@lib/helpers/config.helper';
import { Injectable } from '@nestjs/common';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

interface MailersendPayload {
  receipient: string;
  subject: string;
  data: {
    name: string;
    team_name: string;
    verification_code?: string;
    reset_link?: string;
    password?: string;
  };
  template_id?: string;
}

@Injectable()
export class MailService {
  protected mailerSend: MailerSend;
  protected sentFrom: Sender;
  protected mailDomain: string;

  constructor() {
    this.mailerSend = new MailerSend({
      apiKey: config.get('MAILERSEND_API_KEY'),
    });
    this.sentFrom = new Sender('user@trial-neqvygm859840p7w.mlsender.net', 'Order Team');
  }

  async sendVerificationCode(payload: MailersendPayload) {
    const recipients = [new Recipient(payload.receipient, payload.data.name)];
    const personalization = [
      {
        email: payload.receipient,
        data: payload.data,
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(recipients)
      .setSubject(payload.subject)
      .setPersonalization(personalization)
      .setTemplateId('z3m5jgrkqkdldpyo');

    await this.mailerSend.email.send(emailParams);
  }

  async sendResetPassword(payload: MailersendPayload) {
    const recipients = [new Recipient(payload.receipient, payload.data.name)];
    const personalization = [
      {
        email: payload.receipient,
        data: {
          name: payload.data.name,
          reset_link: payload.data.reset_link,
          team_name: payload.data.team_name,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(recipients)
      .setSubject(payload.subject)
      .setPersonalization(personalization)
      .setTemplateId('pq3enl67y78g2vwr');

    await this.mailerSend.email.send(emailParams);
  }

  async sendStaffRegister(payload: MailersendPayload) {
    const recipients = [new Recipient(payload.receipient, payload.data.name)];
    const personalization = [
      {
        email: payload.receipient,
        data: {
          name: payload.data.name,
          team_name: payload.data.team_name,
          password: payload.data.password,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(recipients)
      .setSubject(payload.subject)
      .setPersonalization(personalization)
      .setTemplateId('351ndgw6q6n4zqx8');

    await this.mailerSend.email.send(emailParams);
  }
}
