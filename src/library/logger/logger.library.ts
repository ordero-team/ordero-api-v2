import { sentry } from '@config/logger.config';
import { config } from '@lib/helpers/config.helper';
import * as Sentry from '@sentry/node';
import { CaptureContext } from '@sentry/types';
import { get } from 'lodash';

export default class Logger {
  private static _instance: Logger;

  private constructor() {
    if (Logger._instance) {
      throw new Error('Error: Instantiation failed: Use Logger.getInstance() instead of new');
    }

    Sentry.init(sentry);
  }

  public static getInstance(): Logger {
    return this._instance || (this._instance = new this());
  }

  notify(exception: any, captureContext?: CaptureContext): string {
    if (!config.isDevelopment()) {
      const axios = get(exception, 'response.data', null);
      const generic = get(exception, 'response', null);
      return Sentry.captureException(exception, { extra: axios || generic || {}, ...(captureContext || {}) });
    } else {
      console.error(exception);
    }
  }
}
