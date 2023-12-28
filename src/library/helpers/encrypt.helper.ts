import { config } from '@lib/helpers/config.helper';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as objectHash from 'object-hash';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const instance = require('simple-encryptor')(config.get('ENCRYPT_KEY'));

export const encrypt = (payload: any) => {
  return instance.encrypt(payload);
};

export const decrypt = (payload: string) => {
  return instance.decrypt(payload);
};

export const hash = (payload: string): Promise<string> => {
  return bcrypt.hash(payload, 10);
};

export const hashAreEqual = (hashedText: string, plainText: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedText);
};

export const sha = (object: any) => {
  return objectHash(object);
};

export const md5 = (text: string) => {
  const hash256 = crypto.createHash('md5');
  hash256.update(text);

  return hash256.digest('hex');
};

export const sha256 = (text: string) => {
  const hash256 = crypto.createHash('sha256');
  hash256.update(text);

  return hash256.digest('hex');
};

export const hmac256 = (text: string, key: string) => {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(text);

  return hmac.digest('hex');
};

export const hmacAreEqual = (a: string, b: string) => {
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};
