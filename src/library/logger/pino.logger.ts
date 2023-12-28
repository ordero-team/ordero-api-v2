/* eslint @typescript-eslint/no-var-requires: off */

export const PinoLogger = async () => {
  const multistream = require('pino-multi-stream').multistream;

  const streams = [];
  streams.push({ stream: process.stdout });

  return multistream(streams);
};
