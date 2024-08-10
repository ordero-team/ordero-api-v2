import { Quero } from '@core/decorators/quero.decorator';
import { Owner } from '@db/entities/owner/owner.entity';
import base64url from '@lib/helpers/base64.helper';
import { config } from '@lib/helpers/config.helper';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Controller, Get, Res } from '@nestjs/common';
import * as fs from 'fs';
import { lookup } from 'mime-types';
import * as path from 'path';

@Controller()
export class AppController {
  @Get()
  async getHello(@Res() response) {
    const check = await AppDataSource.createQueryBuilder(Owner, 't1').getCount();
    console.log({ check });

    return response.send('Ordero API V2');
  }

  @Get('/favicon.ico')
  favicon(@Res() response): string {
    return response.noContent();
  }

  @Get('/files')
  getFiles(@Quero() quero, @Res() response): string {
    if (!quero.view) {
      return response.status(302).redirect('/error?code=404');
    }

    const file = base64url.decode(quero.view);

    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (regexp.test(file)) {
      return response.render('iframe', { name: 'Market Label', url: file });
    }

    if (!fs.existsSync(file)) {
      return response.status(302).redirect('/error?code=404');
    }

    const mime = lookup(file);
    const uri = file.replace(config.getPublicPath(), '');
    const name = path.basename(uri);
    if (['application/pdf', 'text/html'].includes(mime)) {
      return response.render('iframe', { name, url: `${config.getAssetURI()}${uri}` });
    }

    return response
      .headers({
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename=${name}`,
      })
      .send(fs.readFileSync(file));
  }
}
