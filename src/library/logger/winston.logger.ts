// import { datadog } from '@config/logger.config';
// import { config } from '@lib/helpers/config.helper';
import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

const trans = [];
// if (config.isProduction()) {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const os = require('os');
//   trans.push(
//     new transports.Http({
//       host: 'http-intake.logs.datadoghq.com',
//       path: `/api/v2/logs?dd-api-key=${datadog.apiKey}&hostname=${os.hostname()}&service=${datadog.service}&ddsource=nestjs`,
//       ssl: true,
//       level: 'warn',
//     })
//   );
// } else {
trans.push(new transports.Console());
// }

export const WinstonLogger = WinstonModule.createLogger({
  format: format.combine(format.timestamp(), format.ms(), utilities.format.nestLike('ORDERO')),
  transports: trans,
});
