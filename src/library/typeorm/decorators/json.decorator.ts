/* eslint-disable @typescript-eslint/ban-types */

import * as deepmerge from 'deepmerge';
import { ColumnOptions } from 'typeorm';
import { Column } from './column.decorator';

// function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
//   return typeof obj === 'undefined' || obj === null;
// }

// class JsonTransformer<T> implements ValueTransformer {
//   constructor(private readonly defaultValue?: T) {}
//
//   public from(value?: string | null): T | undefined {
//     if (isNullOrUndefined(value)) {
//       return this.defaultValue;
//     }
//
//     try {
//       return JSON.parse(value);
//     } catch (e) {
//       return this.defaultValue;
//     }
//   }
//
//   public to(value?: T | null): string | undefined {
//     if (isNullOrUndefined(value)) {
//       value = this.defaultValue;
//     }
//
//     if (isNullOrUndefined(value)) {
//       return;
//     }
//
//     return JSON.stringify(value);
//   }
// }

export function JsonColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ type: 'json' } as ColumnOptions, options || {});

  // const defaultValue = columnOptions.default;
  //
  // if (columnOptions.default) {
  //   columnOptions.default = undefined;
  // }
  // const jsonTransformer = new JsonTransformer<T>(defaultValue);
  // columnOptions.transformer = {
  //   to: (value: any): any => {
  //     let result = jsonTransformer.to(value);
  //
  //     if (typeof result === 'string') {
  //       result = JSON.parse(result);
  //     }
  //     return result;
  //   },
  //   from: (value: any): any => {
  //     return jsonTransformer.from(value);
  //   },
  // };

  return Column(columnOptions);
}
