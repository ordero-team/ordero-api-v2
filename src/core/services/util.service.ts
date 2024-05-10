import { Injectable } from '@nestjs/common';
import * as bwip from 'bwip-js';
import { ToBufferOptions } from 'bwip-js';

export type ICodePayload = Partial<ToBufferOptions>;

@Injectable()
export class UtilService {
  getBarCode(text: string, options?: ICodePayload): any {
    return bwip.toBuffer({
      text,
      bcid: 'code128',
      height: 10,
      ...(options || {}),
    });
  }

  getQrCode(text: string, options: ICodePayload): any {
    return bwip.toBuffer({
      text,
      bcid: 'qrcode',
      scale: 1,
      ...(options || {}),
    });
  }
}
