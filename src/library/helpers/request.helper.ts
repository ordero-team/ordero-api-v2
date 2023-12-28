import { requestContext } from '@fastify/request-context';
import { get, has, isEmpty } from 'lodash';

export class RequestHelper {
  public static only(payload: any, take = []): any {
    const result = {};
    for (const item of take) {
      if (has(payload, item)) {
        result[item] = get(payload, item, null);
      }
    }

    return result;
  }

  public static has(payload: any, key: string) {
    return has(payload, key);
  }

  public static hasAndValid(payload: any, key: string) {
    return !isEmpty(get(payload, key, null));
  }

  public static getQuery(this, query?: string, def?: any) {
    const queries = requestContext.get('query');
    if (!query) {
      return queries;
    }

    return get(queries, query, def);
  }

  public static getPermissionGrants(this) {
    return requestContext.get('grants');
  }
}
