import { Adapter } from '@lib/fastify/adapter.fastify';
import { PinoLogger } from '@lib/logger/pino.logger';
import { uuid } from '@lib/uid/uuid.library';

export class InstanceFastify {
  async init() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fastify = require('fastify')({
      trustProxy: true,
      genReqId: (request) => {
        return request.headers['x-request-id'] || uuid();
      },
      logger: {
        stream: await PinoLogger(),
        level: 'debug', // this MUST be set at the lowest level of the
        name: '[ASURANSI]',
        serializers: {
          req(request) {
            return {
              method: request.method,
              url: request.url,
              hostname: request.hostname,
              remoteAddress: request.ip,
              remotePort: request.socket.remotePort,
              headers: request.headers,
            };
          },
        },
      },
    });

    fastify.addHook('preHandler', function (req, reply, done) {
      if (req.body) {
        req.log.info({ body: req.body }, 'parsed body');
      }
      done();
    });

    return new Adapter(fastify);
  }
}
