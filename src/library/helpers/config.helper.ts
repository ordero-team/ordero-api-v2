import base64url from '@lib/helpers/base64.helper';
import { BadRequestException } from '@nestjs/common';
import * as path from 'app-root-path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  public get(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new BadRequestException(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.get(k, true));
    return this;
  }

  public getOrigin() {
    const origin = this.get('ORIGIN') || '';

    if (['true', true, 1, 'false', false, 0].includes(origin)) {
      return origin === 'false' ? false : !!origin;
    }

    return origin.split(',');
  }

  public getPort() {
    return this.get('PORT') || 4000;
  }

  public getRootPath() {
    return path.toString();
  }

  public getAssetURI() {
    return `${this.get('API_URI')}/assets`;
  }

  public getDownloadURI(path: string) {
    return `${this.get('API_URI')}/files?view=${base64url.encode(path)}`;
  }

  public getPublicPath() {
    return `${this.getRootPath()}/public`;
  }

  public getTemplatePath() {
    return `${this.getRootPath()}/templates`;
  }

  public isProduction() {
    const mode = this.get('MODE', false);
    return mode === 'production';
  }

  public isDevelopment() {
    const mode = this.get('MODE', false);
    return mode === 'development';
  }

  public isDebugging() {
    return this.get('DEBUG') === 'true';
  }
}
const config = new ConfigService().ensureValues([
  'DATABASE_MASTER_HOST',
  'DATABASE_SLAVE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
]);

export { config };
