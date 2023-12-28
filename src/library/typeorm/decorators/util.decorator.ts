/* eslint-disable @typescript-eslint/ban-types */

import * as deepmerge from 'deepmerge';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ColumnOptions, ValueTransformer } from 'typeorm';
import { Column } from './column.decorator';

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

export function TimeColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ type: 'time' } as ColumnOptions, options || {});

  return Column(columnOptions);
}

export function DateColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ type: 'date' } as ColumnOptions, options || {});

  return Column(columnOptions);
}

export function DateTimeColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ type: 'datetime' } as ColumnOptions, options || {});

  return Column(columnOptions);
}

export function StatusColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge(
    {
      length: 25,
      nullable: false,
    } as ColumnOptions,
    options || {}
  );

  return Column(columnOptions);
}

class PhoneTransformer implements ValueTransformer {
  public from(value?: string | null): any {
    if (isNullOrUndefined(value)) {
      return null;
    }

    return value;
  }

  public to(value?: string | null): any {
    if (isNullOrUndefined(value)) {
      return null;
    }

    try {
      const { number } = parsePhoneNumberFromString(value, 'ID');
      return number;
    } catch (e) {
      return null;
    }
  }
}

export function PhoneColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ length: 25 } as ColumnOptions, options || {});

  columnOptions.transformer = new PhoneTransformer();

  return Column(columnOptions);
}

export function EmailColumn(options?: ColumnOptions): Function {
  const columnOptions = deepmerge({ length: 150 } as ColumnOptions, options || {});

  return Column(columnOptions);
}

export function ForeignColumn(options?: ColumnOptions) {
  options = deepmerge(
    {
      length: '26',
      type: 'varchar',
    } as ColumnOptions,
    options || {}
  ) as ColumnOptions;
  return Column(options);
}
