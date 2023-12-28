import { config } from '@lib/helpers/config.helper';

export const sentry = {
  dsn: config.get('SENTRY_DSN'),
  environment: config.get('MODE'),
  release: config.get('APP_VERSION'),
};

export const datadog = {
  apiKey: config.get('DATADOG_KEY'),
  service: config.get('DATADOG_SERVICE'),
};
