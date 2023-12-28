export class FileHelper {
  static jsonToCSV(data: any, fields: string[], options?: any) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const json2csv = require('json2csv');
    return json2csv.parse(data, { fields, ...(options || {}) });
  }
}
