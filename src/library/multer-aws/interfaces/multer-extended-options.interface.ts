import { ExtendedOptions } from '../multer-sharp';
import { MulterOptions } from './multer-option.interface';

export interface ResizeOptions {
  width: number;
  height: number;
}

export interface MultipleSizeOptions {
  suffix: string;
  width?: number;
  height?: number;
}

export interface MulterExtendedOptions extends Pick<MulterOptions, 'fileFilter' | 'limits'> {
  type?: ExtendedOptions;
  dynamicPath?: string;
  randomFilename?: boolean;
  resize?: ResizeOptions;
  resizeMultiple?: MultipleSizeOptions[];
  thumbnail?: MultipleSizeOptions;
}
