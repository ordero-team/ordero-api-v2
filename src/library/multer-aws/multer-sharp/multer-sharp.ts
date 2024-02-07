/* eslint @typescript-eslint/no-unused-vars: 0 */
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { isFunction, isString } from '@nestjs/common/utils/shared.utils';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { FastifyRequest } from 'fastify';
import { File as FastifyFile, StorageEngine } from 'fastify-multer/lib/interfaces';
import { fromBuffer } from 'file-type';
import { extension, lookup } from 'mime-types';
import { from, Observable } from 'rxjs';
import { first, map, mergeMap, toArray } from 'rxjs/operators';
import * as sharp from 'sharp';
import { S3Storage, S3StorageOptions } from './interfaces/s3-storage.interface';
import { ExtendSize, SharpOptions, Size } from './interfaces/sharp-options.interface';
import { getSharpOptionProps, getSharpOptions, isOriginalSuffix, transformImage } from './multer-sharp.utils';

export interface EventStream {
  stream: NodeJS.ReadableStream;
}
export type File = FastifyFile & EventStream & Partial<S3.Types.PutObjectRequest>;
export type Info = Partial<FastifyFile & ManagedUpload.SendData & S3.Types.PutObjectRequest & sharp.OutputInfo>;

export class MulterSharp implements StorageEngine, S3Storage {
  storageOpts: S3StorageOptions;
  sharpOpts: SharpOptions;

  constructor(options: S3StorageOptions) {
    if (!options.s3) {
      throw new Error('You have to specify s3 object');
    }

    this.storageOpts = options;
    this.sharpOpts = getSharpOptions(options);

    if (!this.storageOpts.Bucket) {
      throw new Error('You have to specify Bucket property');
    }

    if (!isFunction(this.storageOpts.Key) && !isString(this.storageOpts.Key)) {
      throw new TypeError(`Key must be a "string", "function" or undefined`);
    }
  }

  public async duplicateFile(file: File, suffix?: string) {
    suffix = suffix || String(new Date().getTime());

    const newKey = file.Key.replace(/(\.[\w\d_-]+)$/i, '-' + suffix + '$1');
    const { CopyObjectResult } = await this.storageOpts.s3
      .copyObject({
        Bucket: file.Bucket,
        Key: newKey,
        CopySource: file.Bucket + '/' + file.Key,
      })
      .promise();

    const { Location } = file as any;
    return {
      ...file,
      ...(CopyObjectResult || {}),
      Location: Location.replace(file.Key, newKey),
      Key: newKey,
      key: newKey,
    };
  }

  public async uploadBase64File(path: string, file: Buffer) {
    const { storageOpts } = this;

    const { ext, mime } = await fromBuffer(file);
    const params = {
      Bucket: storageOpts.Bucket,
      ACL: storageOpts.ACL,
      Key: `${path}/${randomStringGenerator()}.${ext}`,
      Body: file,
      ContentEncoding: 'base64',
      ContentType: mime,
    };

    const response = await this.storageOpts.s3.upload(params).promise();
    return {
      ...response,
      mimetype: mime,
      ContentType: ext,
      format: ext,
    };
  }

  public removeFile(file: File) {
    return this.storageOpts.s3.deleteObject({ Bucket: file.Bucket, Key: file.Key }).promise();
  }

  public _removeFile(req: FastifyRequest, file: File, callback?: (error: Error) => void) {
    this.storageOpts.s3.deleteObject({ Bucket: file.Bucket, Key: file.Key }, callback || (() => null));
  }

  public _handleFile(req: FastifyRequest, file: File, callback: (error?: any, info?: Partial<FastifyFile>) => void): void {
    const { storageOpts } = this;
    const { mimetype, stream } = file;
    const params = {
      Bucket: storageOpts.Bucket,
      ACL: storageOpts.ACL,
      CacheControl: storageOpts.CacheControl,
      ContentType: storageOpts.ContentType,
      Metadata: storageOpts.Metadata,
      StorageClass: storageOpts.StorageClass,
      ServerSideEncryption: storageOpts.ServerSideEncryption,
      SSEKMSKeyId: storageOpts.SSEKMSKeyId,
      Body: stream,
      Key: storageOpts.Key,
    };

    if (isFunction(storageOpts.Key)) {
      storageOpts.Key(req, file, (err, Key) => {
        if (err) {
          callback(err);
          return;
        }

        // always random the name
        // if (storageOpts.randomFilename) {
        file.originalname = `${randomStringGenerator()}.${extension(mimetype)}`;
        // }

        params.Key = storageOpts.dynamicPath
          ? `${Key}/${storageOpts.dynamicPath}/${file.originalname}`
          : `${Key}/${file.originalname}`;
        params.Key = params.Key.replace(/^\/+/, '');

        mimetype.includes('image')
          ? this.uploadImageFileToS3(params, file, callback)
          : this.uploadFileToS3(params, file, callback);
      });
    }
  }

  private uploadImageFileToS3(params: S3.Types.PutObjectRequest, file: File, callback: (error?: any, info?: Info) => void) {
    const { storageOpts, sharpOpts } = this;
    const { stream } = file;
    const {
      ACL,
      ContentDisposition,
      ContentType: optsContentType,
      StorageClass,
      ServerSideEncryption,
      Metadata,
    } = storageOpts;

    const resizeBucket = getSharpOptionProps(storageOpts);

    if (Array.isArray(resizeBucket) && resizeBucket.length > 0) {
      const sizes$ = from(resizeBucket) as Observable<Size & ExtendSize>;

      sizes$
        .pipe(
          map((size) => {
            const resizedStream = transformImage(sharpOpts, size);

            if (isOriginalSuffix(size.suffix)) {
              size.Body = stream.pipe(sharp());
            } else {
              size.Body = stream.pipe(resizedStream);
            }
            return size;
          }),
          mergeMap((size) => {
            const sharpStream = size.Body;
            const sharpPromise = sharpStream.toBuffer({ resolveWithObject: true });

            return from(
              sharpPromise.then((result) => {
                return {
                  ...size,
                  ...result.info,
                  ContentType: result.info.format,
                  currentSize: result.info.size,
                };
              })
            );
          }),
          mergeMap((size: any) => {
            const { Body, ContentType } = size;
            const newParams = {
              ...params,
              Body,
              ContentType,
              Key: params.Key.replace(/(\.[\w\d_-]+)$/i, '-' + size.suffix + '$1'),
            };
            const upload = storageOpts.s3.upload(newParams);
            const currentSize = { [size.suffix]: 0 };

            upload.on('httpUploadProgress', (event) => {
              if (event.total) {
                currentSize[size.suffix] = event.total;
              }
            });

            const upload$ = from(
              upload.promise().then((result) => {
                // tslint:disable-next-line
                const { Body, ...rest } = size;
                return {
                  ...result,
                  ...rest,
                  currentSize: size.currentSize || currentSize[size.suffix],
                };
              })
            );
            return upload$;
          }),
          toArray(),
          first()
        )
        .subscribe((response) => {
          const multipleUploadedFiles = response.reduce((acc, uploadedFile) => {
            // tslint:disable-next-line
            const { suffix, ContentType, currentSize, ...details } = uploadedFile;
            acc[uploadedFile.suffix] = {
              ACL,
              ContentDisposition,
              StorageClass,
              ServerSideEncryption,
              Metadata,
              ...details,
              size: currentSize,
              ContentType: optsContentType || ContentType,
              mimetype: lookup(ContentType) || `image/${ContentType}`,
            };
            return acc;
          }, {});
          callback(null, JSON.parse(JSON.stringify(multipleUploadedFiles)));
        }, callback);
    } else {
      let currentSize = 0;
      const resizedStream = transformImage(sharpOpts, sharpOpts.resize);
      const newParams = { ...params, Body: stream.pipe(resizedStream) };
      const meta$ = from(newParams.Body.toBuffer({ resolveWithObject: true }));

      meta$
        .pipe(
          first(),
          map((metadata: any) => {
            newParams.ContentType = storageOpts.ContentType || metadata.info.format;
            return metadata;
          }),
          mergeMap((metadata) => {
            const upload = storageOpts.s3.upload(newParams);

            upload.on('httpUploadProgress', (eventProgress) => {
              if (eventProgress.total) {
                currentSize = eventProgress.total;
              }
            });

            const data = upload.promise().then((uploadedData) => ({ ...uploadedData, ...metadata.info }));
            const upload$ = from(data);
            return upload$;
          })
        )
        .subscribe((response) => {
          const { size, format, channels, ...details } = response;
          const data = {
            ACL,
            ContentDisposition,
            StorageClass,
            ServerSideEncryption,
            Metadata,
            ...details,
            size: currentSize || size,
            ContentType: storageOpts.ContentType || format,
            mimetype: lookup(format) || `image/${format}`,
          };
          callback(null, JSON.parse(JSON.stringify(data)));
        }, callback);
    }
  }

  private uploadFileToS3(params: S3.Types.PutObjectRequest, file: File, callback: (error?: any, info?: Info) => void) {
    const { storageOpts } = this;
    const { mimetype } = file;

    params.ContentType = params.ContentType || mimetype;

    const upload = storageOpts.s3.upload(params);
    let currentSize = 0;

    upload.on('httpUploadProgress', (event) => {
      if (event.total) {
        currentSize = event.total;
      }
    });

    upload.promise().then((uploadedData) => {
      const data = {
        size: currentSize,
        ACL: storageOpts.ACL,
        ContentType: storageOpts.ContentType || mimetype,
        ContentDisposition: storageOpts.ContentDisposition,
        StorageClass: storageOpts.StorageClass,
        ServerSideEncryption: storageOpts.ServerSideEncryption,
        Metadata: storageOpts.Metadata,
        ...uploadedData,
      };
      callback(null, JSON.parse(JSON.stringify(data)));
    }, callback);
  }
}
