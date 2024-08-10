import { Brackets, DeepPartial, FindOneOptions, ObjectLiteral } from 'typeorm';

export interface IPagingResponse {
  meta: {
    total_count: number;
    page_count: number;
    page: number;
    per_page: number;
  };
  items: any[];
}

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SelectQueryBuilder<Entity> {
    // AddDateRange(this: SelectQueryBuilder<Entity>, START_DATE, END_DATE): SelectQueryBuilder<Entity>;
    nextWhere(where: string | Brackets | ((qb: this) => string), parameters?: ObjectLiteral): this;
    selectWithAlias(selection: string[]): this;
    search(): this;
    dateRange(column?: string): this;
    sort(): this;
    getPaged(): Promise<IPagingResponse>;
    getRawPaged(modifiers?: (items: any[]) => Promise<any[]>): Promise<IPagingResponse>;
  }
}

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    findOrCreate(options?: DeepPartial<Entity>): Promise<Entity | undefined>;
    exists(options?: FindOneOptions<Entity>): Promise<boolean>;
  }
}
