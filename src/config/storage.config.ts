import { config } from '@lib/helpers/config.helper';

export const storage = {
  aws: {
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
    endpoint: config.get('AWS_ENDPOINT'),
    bucket: config.get('AWS_BUCKET'),
    region: config.get('AWS_REGION'),
  },
};
