import { config } from '@lib/helpers/config.helper';

export const sentry = {
  dsn: config.get('SENTRY_DSN'),
  environment: config.get('MODE'),
  release: config.get('APP_VERSION'),
};
