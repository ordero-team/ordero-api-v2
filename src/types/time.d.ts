import * as time from 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    isBetween(a: time.ConfigType, b: time.ConfigType, c?: time.OpUnitType | null, d?: string): boolean;
  }
}
