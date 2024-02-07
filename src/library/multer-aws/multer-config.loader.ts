import { BadRequestException, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { MULTER_EXTENDED_S3_OPTIONS } from './constants';
import { MulterExtendedS3Options, MulterModuleOptions, MulterOptionsFactory } from './interfaces';
import { AmazonS3Storage, ImageFileExtensions, MulterExceptions } from './multer-sharp';

interface MulterS3ConfigService extends MulterOptionsFactory {
  filterImageFileExtension(req, file, cb): any;
}

@Injectable()
export class MulterConfigLoader implements MulterS3ConfigService {
  static DEFAULT_ACL = 'public-read';
  static DEFAULT_REGION = 'us-west-2';
  static DEFAULT_MAX_FILESIZE = 3145728;
  private readonly s3: S3;
  private readonly logger: LoggerService;

  constructor(@Inject(MULTER_EXTENDED_S3_OPTIONS) private s3Options: MulterExtendedS3Options) {
    // AWS.config.update({
    //   accessKeyId: s3Options.accessKeyId,
    //   secretAccessKey: s3Options.secretAccessKey,
    //   region: s3Options.region || MulterConfigLoader.DEFAULT_REGION,
    // });

    this.s3 = new S3({
      accessKeyId: s3Options.accessKeyId,
      secretAccessKey: s3Options.secretAccessKey,
      region: s3Options.region || MulterConfigLoader.DEFAULT_REGION,
      // endpoint: s3Options.endpoint,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    this.logger = s3Options.logger || new Logger(MulterConfigLoader.name);
    this.logger.log(JSON.stringify(s3Options));
  }

  createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
    const storage = AmazonS3Storage({
      Key: (req, file, cb) => {
        const basePath = `${this.s3Options.basePath || ''}`;

        cb(null, basePath);
      },
      s3: this.s3,
      Bucket: this.s3Options.bucket,
      ACL: this.s3Options.acl || MulterConfigLoader.DEFAULT_ACL,
    });

    return {
      storage,
      fileFilter: this.filterImageFileExtension,
      limits: {
        fileSize: +this.s3Options.fileSize || MulterConfigLoader.DEFAULT_MAX_FILESIZE,
      },
    };
  }

  filterImageFileExtension(req, file, cb) {
    const { mimetype } = file;
    const extension = mimetype.substring(mimetype.lastIndexOf('/') + 1);
    const mimetypeIsNotImage = (ext: ImageFileExtensions): boolean => !Object.values(ImageFileExtensions).includes(ext);

    if (mimetypeIsNotImage(extension)) {
      req.fileValidationError = MulterExceptions.INVALID_IMAGE_FILE_TYPE;
      return cb(new BadRequestException(MulterExceptions.INVALID_IMAGE_FILE_TYPE), false);
    }

    return cb(null, true);
  }
}
