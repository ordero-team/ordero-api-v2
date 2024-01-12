import { ExceptionFilter } from '@core/filters/exception.filter';
import { InstanceFastify } from '@lib/fastify/instance.fastify';
import { handlebars } from '@lib/handlebars/adapter.library';
import { config } from '@lib/helpers/config.helper';
import { WinstonLogger } from '@lib/logger/winston.logger';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastify = new InstanceFastify();
  const httpAdapter = await fastify.init();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fastifyListRoutes = require('fastify-list-routes');

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, httpAdapter, {
    logger: WinstonLogger,
  });

  await app.register(fastifyListRoutes, { colors: true });

  // ============== Middleware ==============
  app.useGlobalFilters(new ExceptionFilter());

  // ============== enable CORS ==============
  app.enableCors({ origin: config.getOrigin() });

  // ============== set static assets ==============
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/assets/',
  });

  // ============== set handlebars ==============
  app.setViewEngine({
    engine: { handlebars },
    templates: join(__dirname, '..', 'templates'),
  });

  // ============== run server ==============
  await app.listen(Number(config.getPort()), '0.0.0.0', (err, address) => {
    if (err) throw err;

    console.log(`Server is now listening on ${address}`);
  });
}

void bootstrap();
