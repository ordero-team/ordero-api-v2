import { IParamsFilter } from '@lib/rbac';

export class ParamsFilter implements IParamsFilter {
  private storage: any = {};

  getParam(filter: string): any {
    return this.storage[filter];
  }

  setParam(filter: string, ...params: any[]): IParamsFilter {
    this.storage[filter] = params;
    return this;
  }
}
