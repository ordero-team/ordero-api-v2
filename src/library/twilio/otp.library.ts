import { config } from '@lib/helpers/config.helper';
import Logger from '@lib/logger/logger.library';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Twilio = require('twilio');

export class TwilioOTP {
  private twilio;

  constructor() {
    this.twilio = new Twilio(config.get('TWILLIO_SID'), config.get('TWILLIO_TOKEN'));
  }

  send(number: string) {
    return this.twilio.verify
      .services(config.get('TWILLIO_SERVICE'))
      .verifications.create({ to: number, channel: 'sms', locale: 'id' });
  }

  async verify(number: string, code: string): Promise<boolean> {
    try {
      await this.twilio.verify.services(config.get('TWILLIO_SERVICE')).verificationChecks.create({ to: number, code });

      return true;
    } catch (e) {
      Logger.getInstance().notify(e);

      return false;
    }
  }
}
