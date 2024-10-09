import { Datasource } from '@lib/typeorm/datasource.typeorm';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

jest.setTimeout(30000); // 30 seconds timeout

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let datasource: Datasource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    try {
      datasource = moduleFixture.get<Datasource>(Datasource);
      await datasource.initialize();
    } catch (error) {
      console.error('Failed to get or initialize Datasource:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (datasource) {
      await datasource.destroy();
    }
    await app.close();
    // Add a small delay to allow connections to fully close
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Ordero API V2');
  });
});
