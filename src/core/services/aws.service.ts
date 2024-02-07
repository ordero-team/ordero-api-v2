import { Media } from '@db/entities/core/media.entity';
import { MULTER_MODULE_OPTIONS, MulterExtendedOptions, MulterModuleOptions } from '@lib/multer-aws';
import { AmazonS3Storage, ExtendedOptions, transformException } from '@lib/multer-aws/multer-sharp';
import { S3StorageOptions } from '@lib/multer-aws/multer-sharp/interfaces/s3-storage.interface';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as multer from 'fastify-multer';
import { isEmpty } from 'lodash';

@Injectable()
export class AwsService {
  constructor(@Inject(MULTER_MODULE_OPTIONS) private options: MulterModuleOptions, private httpService: HttpService) {}

  async uploadFile(req: any, res: any, fieldName = 'image', localOptions?: MulterExtendedOptions): Promise<any> {
    // set default options
    localOptions = {
      type: ExtendedOptions.CREATE_THUMBNAIL,
      thumbnail: { suffix: 'thumb', width: 200, height: 200 },
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: (request: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|csv|vnd.ms-excel)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file type'), false);
        }
      },
      ...localOptions,
    };

    const instance = (multer as any)({ ...this.options, ...localOptions });
    if (localOptions) {
      instance.storage = this.pickStorageOptions(localOptions);
    }

    await new Promise<void>((resolve, reject) =>
      instance.single(fieldName)(req, res, (err: any) => {
        if (err) {
          return reject(transformException(err));
        }

        return resolve();
      })
    );

    return req.file;
  }

  async uploadFromURL(url: string, path: string, localOptions?: MulterExtendedOptions): Promise<any> {
    const s3 = this.pickStorageOptions(localOptions || {});
    const response = await this.httpService.get(url, { responseType: 'arraybuffer' }).toPromise();
    return s3.uploadBase64File(path, response.data);
  }

  async uploadFromBuffer(buffer: Buffer, path: string): Promise<any> {
    const s3 = this.pickStorageOptions({});
    return s3.uploadBase64File(path, buffer);
  }

  async removeFile(media: Media | null, localOptions?: MulterExtendedOptions): Promise<any> {
    const s3 = this.pickStorageOptions(localOptions || {});
    if (media.file && !isEmpty(media.file)) {
      await s3.removeFile(media.file);
    }

    // finally remove the media itself
    await media.remove();
  }

  async duplicateFile(media: Media | null, localOptions?: MulterExtendedOptions): Promise<any> {
    const s3 = this.pickStorageOptions(localOptions || {});

    const result = {};
    if (media.url) {
      const file = await this.httpService.get(media.url, { responseType: 'arraybuffer' }).toPromise();
      Object.assign(result, { url: await s3.duplicateFile(file.data) });
    }

    return result;
  }

  pickStorageOptions(localOptions: MulterExtendedOptions) {
    let storageOptions: S3StorageOptions;
    const extendedOptionProperty = localOptions.type;

    switch (extendedOptionProperty) {
      case ExtendedOptions.CREATE_THUMBNAIL:
        storageOptions = {
          ...this.options.storage.storageOpts,
          resize: [localOptions[extendedOptionProperty], { suffix: 'original' }],
          ignoreAspectRatio: true,
          dynamicPath: localOptions.dynamicPath,
        };
        return AmazonS3Storage(storageOptions);
      case ExtendedOptions.RESIZE_IMAGE:
        storageOptions = {
          ...this.options.storage.storageOpts,
          resize: localOptions[extendedOptionProperty],
          dynamicPath: localOptions.dynamicPath,
        };
        return AmazonS3Storage(storageOptions);
      case ExtendedOptions.RESIZE_IMAGE_MULTIPLE_SIZES:
        storageOptions = {
          ...this.options.storage.storageOpts,
          resizeMultiple: localOptions[extendedOptionProperty],
          ignoreAspectRatio: true,
          dynamicPath: localOptions.dynamicPath,
        };
        return AmazonS3Storage(storageOptions);
      default:
        return AmazonS3Storage({ ...this.options.storage.storageOpts, ...localOptions });
    }
  }
}
