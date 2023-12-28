import * as deepmerge from 'deepmerge';
import { ColumnOptions } from 'typeorm';
import { Column } from './column.decorator';

// const monotonic = monotonicFactory();

export interface ULIDColumnOptions {
  // defaul: true
  isMonotonic: boolean;
}

// class ULIDTransformer implements ValueTransformer {
//   constructor(private readonly options: ULIDColumnOptions) {}
//   public from(value: string): string {
//     return value;
//   }
//   public to(value: string | undefined): string {
//     if (value) {
//       return value;
//     }
//
//     return this.options.isMonotonic ? monotonic() : ulid();
//   }
// }

export function ULID(trasformerOptions?: ULIDColumnOptions, options?: ColumnOptions) {
  options = deepmerge(
    {
      length: '26',
      type: 'varchar',
      primary: true,
      nullable: false,
    } as ColumnOptions,
    options || {}
  ) as ColumnOptions;

  // trasformerOptions = deepmerge(
  //   {
  //     isMonotonic: true,
  //   },
  //   trasformerOptions || {}
  // );

  // options.transformer = new ULIDTransformer(trasformerOptions);

  return Column(options);
}
