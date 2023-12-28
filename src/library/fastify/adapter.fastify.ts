import { config } from '@lib/helpers/config.helper';
import { RequestHelper } from '@lib/helpers/request.helper';
import { handlebars } from '@lib/handlebars/adapter.library';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import fastifyMultipart from '@fastify/multipart';
import fastifyRequestContext from '@fastify/request-context';
import { Transformer } from '@lib/transformer/main.transformer';
import { HttpStatus } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as Fastify from 'fastify';
import * as fs from 'fs';

export class Adapter extends FastifyAdapter {
  private fsInstance: Fastify.FastifyInstance;
  constructor(fastify?: Fastify.FastifyInstance) {
    super(fastify);

    this.fsInstance = fastify;

    this.decorateRequest();
    this.decorateReply();
    this.adapterRegister();
    this.hookRegister();
  }

  decorateRequest() {
    // tslint:disable-next-line:only-arrow-functions
    this.fsInstance.decorateRequest('only', function (take: string[]) {
      return RequestHelper.only(this.body, take);
    });
    this.fsInstance.decorateRequest('has', function (key: string) {
      return RequestHelper.has(this.body, key);
    });
    this.fsInstance.decorateRequest('hasAndValid', function (key: string) {
      return RequestHelper.hasAndValid(this.body, key);
    });
  }

  decorateReply() {
    // tslint:disable-next-line:only-arrow-functions
    this.fsInstance.decorateReply(
      'item',
      async function (entity: any, transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.item(entity, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply(
      'collection',
      async function (entities: any[], transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.collection(entities, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply(
      'paginate',
      async function (entity: any, transformer: TransformerAbstract, status: number = HttpStatus.OK) {
        const instance = Transformer.create().withContext(this);
        const result = await instance.paginate(entity, transformer);
        this.status(status).send({ success: true, request_id: this.request.id, result });
      }
    );

    this.fsInstance.decorateReply('data', function (result: any, status: number = HttpStatus.OK) {
      this.status(status).send({ success: true, request_id: this.request.id, result });
    });

    this.fsInstance.decorateReply('noContent', function () {
      this.status(HttpStatus.NO_CONTENT).send();
    });

    this.fsInstance.decorateReply('render', function (template: string, content: any = {}, status: number = HttpStatus.OK) {
      const path = template.replace('.', '/');
      const html = fs.readFileSync(`${config.getTemplatePath()}/${path}.hbs`, 'utf8');
      const compiled = handlebars.compile(html)(content);

      this.status(status).type('text/html').send(compiled);
    });
  }

  adapterRegister() {
    // multipart file upload
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.fsInstance.register(fastifyMultipart, {
      // addToBody: true,
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 1000000, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        // fileSize: 100, // For multipart forms, the max file size
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
      },
    });

    this.fsInstance.register(fastifyRequestContext, {
      defaultStoreValues: {
        query: {},
      },
    });
  }

  hookRegister() {
    this.fsInstance.addHook('onRequest', (req, reply, done) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parse = require('url').parse(req.url, { parseQueryString: true });
      const queries = JSON.parse(JSON.stringify(parse.query));
      req.requestContext.set('query', queries);
      done();
    });
  }
}
