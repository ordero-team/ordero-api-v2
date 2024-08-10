import { RequestHelper } from '@lib/helpers/request.helper';
import { time } from '@lib/helpers/time.helper';
import { IPagingResponse } from '@type/query';
import { camelCase, get } from 'lodash';
import { createQueryBuilder, ObjectLiteral, OrderByCondition } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export const getPageInfo = () => {
  let page: number = parseInt(RequestHelper.getQuery('page', 1), 10);
  let take: number = parseInt(RequestHelper.getQuery('per_page', 25), 10);

  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }

  if (Number.isNaN(take) || take <= 0) {
    take = 25;
  }

  const skip = (page - 1) * take;

  return { skip, take, page };
};

export const getPageCount = (totalCount: number, take: number) => {
  if (take < 1) {
    return totalCount > 0 ? 1 : 0;
  }

  totalCount = totalCount < 0 ? 0 : totalCount;
  return parseInt(String((totalCount + take - 1) / take), 10);
};

// Get Date Range Selection (Add Where Conditions).
SelectQueryBuilder.prototype.getPaged = async function (): Promise<IPagingResponse> {
  const { skip, take, page } = getPageInfo();
  const [collection, count] = await this.skip(skip).take(take).getManyAndCount();

  return {
    meta: {
      total_count: count,
      page_count: getPageCount(count, take),
      page,
      per_page: take,
    },
    items: collection,
  };
};

SelectQueryBuilder.prototype.getRawPaged = async function (
  modifiers?: (items: any[]) => Promise<any[]>
): Promise<IPagingResponse> {
  const { skip, take, page } = getPageInfo();
  //TODO: skip and take don't work with raw many
  const collection = await this.offset(skip).limit(take).getRawMany();
  const count = await this.getCount();

  return {
    meta: {
      total_count: count,
      page_count: getPageCount(count, take),
      page,
      per_page: take,
    },
    items: typeof modifiers === 'function' ? await modifiers(collection) : collection,
  };
};

SelectQueryBuilder.prototype.nextWhere = function (where: any, parameters?: ObjectLiteral): SelectQueryBuilder<any> {
  const hasWhere = this.getQuery().includes('WHERE');
  if (hasWhere) {
    this.andWhere(where, parameters);
  } else {
    this.where(where, parameters);
  }

  return this;
};

SelectQueryBuilder.prototype.selectWithAlias = function (selection: string[]): SelectQueryBuilder<any> {
  const aliases = this.expressionMap.aliases.map((row) => `${row.name}.`).join('|');
  const select = selection.map((row) => {
    if (row.charAt(0) === '_') {
      return row.replace('_', '');
    }

    const alias = row.replace(new RegExp('\\b(' + aliases + ')\\b', 'gi'), '');
    return `${row} AS ${alias}`;
  });

  this.select(select);

  return this;
};

SelectQueryBuilder.prototype.search = function (): SelectQueryBuilder<any> {
  const entity = this.expressionMap.mainAlias.target;
  const searchable: string[] = get(entity, 'searchable', []);

  const queries = RequestHelper.getQuery();
  const searches = Object.keys(queries).filter((row) => searchable.includes(row) && queries[row]);

  for (const search of searches) {
    const funcName = camelCase(`on_filter_${search}`);
    if (typeof entity[funcName] === 'function') {
      entity[funcName](queries[search], this);
    }
  }

  return this;
};

SelectQueryBuilder.prototype.sort = function (): SelectQueryBuilder<any> {
  const entity = this.expressionMap.mainAlias.target;
  const sortable: string[] = get(entity, 'sortable', []);

  let sort: string = RequestHelper.getQuery('sort', null);
  if (!sort) {
    sort = get(entity, 'defaultSort', []).join(',');
  }

  const orders: OrderByCondition[] = sort.split(',').map((row) => {
    const direction = row.charAt(0) === '-' ? 'DESC' : 'ASC';
    const trim = direction === 'DESC' ? row.substring(1) : row;
    return sortable.includes(trim) ? { [trim]: direction } : null;
  });

  orders.filter(Boolean).forEach((order) => this.orderBy(order));

  return this;
};

SelectQueryBuilder.prototype.dateRange = function (column?: string): SelectQueryBuilder<any> {
  const queries = RequestHelper.getQuery();
  const entity = this.expressionMap.mainAlias.name;
  let start = get(queries, 'start', null);
  let end = get(queries, 'end', null);

  if (start) {
    start = time.unix(Number(start)).format('YYYY-MM-DD HH:mm:ss');
  }
  if (end) {
    end = time.unix(Number(end)).format('YYYY-MM-DD HH:mm:ss');
  }

  if (typeof column == 'undefined') {
    column = 'created_at';
  }

  if (start) {
    this.nextWhere(`${entity}.${column} >= :start`, { start });
  }
  if (end) {
    this.nextWhere(`${entity}.${column} <= :end`, { end });
  }

  return this;
};

export { createQueryBuilder };
