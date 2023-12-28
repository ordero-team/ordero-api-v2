/* eslint @typescript-eslint/no-var-requires: off */
import { datadog } from '@config/logger.config';
import { config } from '@lib/helpers/config.helper';

export const PinoLogger = async () => {
  const writeStream = await require('pino-datadog').createWriteStream(datadog);
  const multistream = require('pino-multi-stream').multistream;

  const streams = [];
  if (config.isProduction()) {
    streams.push({ stream: writeStream });
  } else {
    streams.push({ stream: process.stdout });
  }

  return multistream(streams);
};
