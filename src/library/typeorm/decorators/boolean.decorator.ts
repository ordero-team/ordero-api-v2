/* eslint-disable @typescript-eslint/ban-types */

import * as deepmerge from 'deepmerge';
import { ColumnOptions } from 'typeorm';
import { Column } from './column.decorator';

// function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
//   return typeof obj === 'undefined' || obj === null;
// }

// class BooleanTransformer implements ValueTransformer {
//   public from(value?: number | null): boolean | undefined {
//     if (isNullOrUndefined(value)) {
//       return;
//     }
//     return value ? true : false;
//   }
//
//   public to(value?: boolean | null): number | undefined {
//     if (isNullOrUndefined(value)) {
//       return;
//     }
//     return value ? 1 : 0;
//   }
// }

export function BooleanColumn(options?: ColumnOptions): Function {
  // const columnOptions = deepmerge(
  //   {
  //     type: 'tinyint',
  //     width: 1,
  //   } as ColumnOptions,
  //   options || {}
  // );
  // columnOptions.transformer = new BooleanTransformer();

  const columnOptions = deepmerge({ type: 'boolean' } as ColumnOptions, options || {});
  if (columnOptions.default !== undefined) {
    columnOptions.default = columnOptions.default ? 1 : 0;
  } else {
    columnOptions.default = 0;
  }

  return Column(columnOptions);
}
