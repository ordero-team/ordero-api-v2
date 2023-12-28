/* eslint-disable @typescript-eslint/ban-types */

import * as deepmerge from 'deepmerge';
import { ColumnOptions } from 'typeorm';
import { Column } from './column.decorator';

export function NotNullColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ nullable: false } as ColumnOptions, options || {});

  return Column(columnOptions);
}
