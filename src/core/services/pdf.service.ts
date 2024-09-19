import { handlebars } from '@lib/handlebars/adapter.library';
import { config } from '@lib/helpers/config.helper';
import { Injectable } from '@nestjs/common';
import HTMLToPDF, { LaunchOptions, PDFOptions } from 'convert-html-to-pdf';
import * as fs from 'fs';

export interface IPdfOption {
  browser?: LaunchOptions;
  pdf?: PDFOptions;
  waitForNetworkIdle?: boolean;
}

@Injectable()
export class PdfService {
  create(template: string, data: any, options?: IPdfOption) {
    const html = fs.readFileSync(`${config.getTemplatePath()}/pdf/${template}.hbs`, 'utf8');
    const compiled = handlebars.compile(html)(data);
    const htmlToPdf = new HTMLToPDF(compiled, {
      waitForNetworkIdle: options.waitForNetworkIdle || false,
      browserOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        ...(options.browser || {}),
      },
      pdfOptions: {
        printBackground: true,
        ...(options.pdf || {}),
      },
    });

    return htmlToPdf.convert();
  }

  async billInvoice(data: any) {
    return this.create('bill', data, {
      pdf: {
        width: '80mm',
        margin: {
          top: 0.5,
          bottom: 0.5,
          left: 0.5,
          right: 0.5,
        },
      },
    });
  }

  async tableLabel(data: any) {
    return this.create(
      'label-table',
      { data },
      {
        pdf: {
          width: '14.85cm',
          height: '21cm',
          margin: {
            top: 0.5,
            bottom: 0.5,
            left: 0.5,
            right: 0.5,
          },
        },
      }
    );
  }
}
