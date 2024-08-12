import { uuid } from '@lib/uid/uuid.library';
import * as fs from 'fs';
import { camelCase, forOwn, groupBy, isPlainObject, shuffle, snakeCase, startCase } from 'lodash';
import { time } from './time.helper';

const romanize = (num) => {
  const roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let str = '';

  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
};

export const randomChar = (length = 4) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return shuffle(chars).join('').substring(0, length);
};

export const keygen = (length = 25, caps = 'all') => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Key } = require('tokeylic-gen');
  return new Key({ keyLength: length, caps }).gen();
};

export const sequenceNumber = (id: number | string, prefix = 'TRX', suffix?: number | string) => {
  // convert `2020-03-11 19:38:12.000182` into 10 digits numeric
  // const pad = String(datetime.valueOf()).padStart(9, '0');

  const date = new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = date.getMonth() + 1;

  return `${prefix}/${romanize(year)}/${romanize(month)}/${id}${suffix ? '/' + suffix : ''}`;
};

export const formatLongNumber = (numeric: any) => {
  const value = parseInt(numeric, 10);
  if (value === 0) {
    return 0;
  }

  if (value <= 999) {
    return value;
  } else if (value >= 1000 && value <= 99999) {
    const num = value / 1000;
    return num.toFixed(2) + 'K';
  } else if (value >= 100000 && value <= 9999999) {
    const num = value / 100000;
    return num.toFixed(2) + 'L';
  } else if (value >= 10000000 && value <= 999999999) {
    const num = value / 10000000;
    return num.toFixed(2) + 'CR';
  } else if (value >= 1000000000 && value <= 99999999999) {
    const num = value / 1000000000;
    return num.toFixed(2) + 'B';
  }

  return value;
};

export const getNextKey = (str: string | number) => {
  str = typeof str === 'number' ? String(str) : str;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const length = alphabet.length;
  let result = str;
  let i = str.length;

  while (i >= 0) {
    const last: any = str.charAt(--i);
    let next: any = '';
    let carry = false;

    if (isNaN(last)) {
      const index = alphabet.indexOf(last.toLowerCase());

      if (index === -1) {
        next = last;
        carry = true;
      } else {
        const isUpperCase = last === last.toUpperCase();
        next = alphabet.charAt((index + 1) % length);
        if (isUpperCase) {
          next = next.toUpperCase();
        }

        carry = index + 1 >= length;
        if (carry && i === 0) {
          const added = isUpperCase ? 'A' : 'a';
          result = added + next + result.slice(1);
          break;
        }
      }
    } else {
      next = +last + 1;
      if (next > 9) {
        next = 0;
        carry = true;
      }

      if (carry && i === 0) {
        result = '1' + next + result.slice(1);
        break;
      }
    }

    result = result.slice(0, i) + next + result.slice(i + 1);
    if (!carry) {
      break;
    }
  }

  return result;
};

function walk(obj, cb): any {
  const x = Array.isArray(obj) ? [] : {};

  forOwn(obj, (v, k) => {
    if (isPlainObject(v) || Array.isArray(v)) {
      v = walk(v, cb);
    }

    x[cb(k)] = v;
  });

  return x;
}

export function keysToCamel<T>(obj: Record<string, any>): T {
  return walk(obj, (k) => camelCase(k));
}

export function keysToSnake<T>(obj: Record<string, any>): T {
  return walk(obj, (k) => snakeCase(k));
}

export const slug = (text: string, suffix: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return `${require('slug')(text, { lower: true })}${suffix ? '-' + suffix.toLowerCase() : ''}`;
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateURL = (string) => {
  const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

export const castToNumbers = (o, rules = {}) => {
  Object.keys(o).forEach((k) => {
    if (typeof o[k] === 'object') {
      return castToNumbers(o[k], rules);
    }

    const rule = (rules[k] || '').split('|');
    o[k] = rule.includes('numeric') || rule.includes('integer') ? parseFloat(o[k]) : o[k];
  });

  return o;
};

export const generateSKU = (text: string) => {
  let str = '';
  const m = startCase(text).match(/[A-Z][a-z]*/g);
  for (const n of m || []) {
    const substring = n.toLowerCase().replace(/[aeiou]/g, '');
    str += substring.substring(0, 2);
  }
  str = str.padEnd(5, '0').substring(0, 5);

  const number = String(new Date().getTime()).padStart(5, '0').substr(-3);
  const random = randomChar(3);
  const results = `SKU-${str}${number}${random}`;

  return results.toUpperCase();
};

export const isTrue = (value: any) => {
  return [true, 'true', 1, '1'].includes(value);
};

export const buildQueryString = (params: any): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('querystring').stringify(params);
};

export const parseGeoLoc = (geoloc: string): { lat: string; lon: string } => {
  const [lat, lon] = (geoloc || '').replace(/ /g, '').split(',');
  return { lat: lat || null, lon: lon || null };
};

export const writeFile = (dir: string, name: string, data: any) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const path = `${dir}/${name}`;
  fs.writeFileSync(path, data);

  return path;
};

export const formatRupiah = (angka, prefix = true) => {
  const number_string = String(parseFloat(angka))
    .replace(/[^,\d]/g, '')
    .toString();
  const split = number_string.split(',');
  const sisa = split[0].length % 3;
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
  let rupiah = split[0].substr(0, sisa);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix === undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
};

export const mostFreq = (arr: any[]) => {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b));
};

export const getChartData = async (
  { start, end }: { start: Date; end: Date },
  data: any[],
  columnName: string
): Promise<{ id: string; count: number; total: number; label: string; labelType: 'daily' | 'hourly' }[]> => {
  start =
    start ||
    time(Math.min(...data.map((v) => v.created_at)))
      .set('hour', 0)
      .set('minute', 0)
      .toDate();
  end = end || time().set('hour', 23).set('minute', 59).toDate();

  const diff = -time(start).diff(end, 'day');
  const timeDiffCount = diff !== 0 ? diff : -time(start).diff(end, 'hour');
  const timeDiffType = diff !== 0 ? 'daily' : 'hourly';

  const results = [];
  for (let count = 0; count <= timeDiffCount; count++) {
    const adder = timeDiffType === 'daily' ? 'day' : 'hour';
    const formatTime = timeDiffType === 'daily' ? 'DD MMM' : 'HH';

    const timeCounter = time(start).add(count, adder);
    const groupedData = groupBy(data, (o) => time(o.created_at).format(formatTime));
    const label = timeCounter.format(formatTime);
    const total = groupedData[label]?.reduce((prevValue, data) => prevValue + Number(data[columnName]), 0) || 0;
    const dataCount = groupedData[label]?.length || 0;
    const result = {
      id: uuid(),
      count: dataCount,
      total,
      label: timeCounter,
      labelType: timeDiffType,
    };

    results.push(result);
  }

  return results;
};
