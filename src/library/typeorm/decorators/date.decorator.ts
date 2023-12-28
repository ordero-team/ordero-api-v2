/* eslint-disable @typescript-eslint/ban-types */

import { ColumnOptions, getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';

export function CreateDateColumn(options?: ColumnOptions): Function {
  // tslint:disable-next-line:only-arrow-functions
  return function (object: Record<string, any>, propertyName: string) {
    getMetadataArgsStorage().columns.push({
      propertyName,
      target: object.constructor,
      mode: 'createDate',
      options: Object.assign(
        {
          type: 'datetime',
          precision: 6,
          default: () => 'CURRENT_TIMESTAMP(6)',
        },
        options
      ),
    } as ColumnMetadataArgs);
  };
}

export function UpdateDateColumn(options?: ColumnOptions): Function {
  // tslint:disable-next-line:only-arrow-functions
  return function (object: Record<string, any>, propertyName: string) {
    getMetadataArgsStorage().columns.push({
      propertyName,
      target: object.constructor,
      // mode: 'updateDate',
      mode: 'regular',
      options: Object.assign(
        {
          type: 'datetime',
          precision: 6,
          default: () => 'CURRENT_TIMESTAMP(6)',
          onUpdate: 'CURRENT_TIMESTAMP(6)',
        },
        options
      ),
    } as ColumnMetadataArgs);
  };
}
