/* eslint-disable @typescript-eslint/ban-types */

import * as deepmerge from 'deepmerge';
import { ColumnOptions, ValueTransformer } from 'typeorm';
import { Column } from './column.decorator';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

class PriceTransformer implements ValueTransformer {
  public from(value?: string | null): number | undefined {
    if (isNullOrUndefined(value)) {
      return null;
    }

    return parseFloat(value);
  }

  public to(value?: string | null): string | undefined {
    return value;
  }
}

export function PriceColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge(
    {
      type: 'decimal',
      precision: 16,
      scale: 2,
      default: '0.00',
    } as ColumnOptions,
    options || {}
  );

  columnOptions.transformer = new PriceTransformer();

  return Column(columnOptions);
}
