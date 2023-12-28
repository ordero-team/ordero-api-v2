import { keysToSnake, randomChar, slug } from '@lib/helpers/utils.helper';
import { getPageCount, getPageInfo } from '@lib/typeorm/query-builder.library';
import { NotFoundException } from '@nestjs/common';
import { IPagingResponse } from '@type/query';
import { classToClass, classToPlain } from 'class-transformer';
import { isEmpty, startCase } from 'lodash';
import {
  BaseEntity as Base,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectID,
  RemoveOptions,
  SaveOptions,
} from 'typeorm';

export class BasicEntity extends Base {
  // =============== STATIC METHODS ===============

  static async exists<T extends Base>(this: (new () => T) & typeof Base, options?: FindOneOptions<T>): Promise<boolean> {
    const obj = await this.count<T>(options);

    return obj > 0;
  }

  static async findOrCreate<T extends Base>(
    this: (new () => T) & typeof Base,
    options?: DeepPartial<T>
  ): Promise<T | undefined> {
    let obj = await this.findOne<T>({ where: options || {} } as any);
    if (isEmpty(obj)) {
      obj = this.create<T>(options);
    }

    return obj;
  }

  static async findOrFail<T extends Base>(
    this: (new () => T) & typeof Base,
    options: FindOneOptions<T>
  ): Promise<T | undefined> {
    const obj = await this.findOne<T>(options);
    if (isEmpty(obj)) {
      throw new NotFoundException(`Could not find entity ${startCase(this.name).toLowerCase()}`);
    }

    return obj;
  }

  static async findOrFailByCompany<T extends Base>(
    this: {
      new (): T;
    } & typeof Base,
    id?: string | number | Date | ObjectID,
    company?: any
  ): Promise<T | undefined> {
    const obj = await this.findOne<T>({ where: { id, company_id: company.id } } as any);
    if (isEmpty(obj)) {
      throw new NotFoundException(`Could not find entity ${startCase(this.name).toLowerCase()} on the company`);
    }

    return obj;
  }

  static async paginate<T extends Base>(
    this: (new () => T) & typeof Base,
    options?: FindManyOptions<T>
  ): Promise<IPagingResponse> {
    const { skip, take, page } = getPageInfo();
    const [collection, count] = await this.findAndCount<T>({ ...(options || {}), skip, take });

    return {
      meta: {
        total_count: count,
        page_count: getPageCount(count, take),
        page,
        per_page: take,
      },
      items: collection,
    };
  }

  static async slug<T extends Base>(this: (new () => T) & typeof Base, name: string): Promise<string> {
    let domain;
    let exists;
    let suffix = '';
    do {
      domain = slug(name, suffix);
      exists = await this.findOne({ where: { slug: domain } } as any);
      suffix = randomChar();
    } while (!isEmpty(exists));

    return domain;
  }

  // =============== METHODS ===============
  toJSON(): this {
    // deleting relation
    // prefix __ is promise value
    const entity = classToClass(this, { excludePrefixes: ['__'] });
    for (const key of Object.keys(entity)) {
      if (entity[key] instanceof Base) {
        delete entity[key];
      }
    }

    return keysToSnake(classToPlain(entity));
  }

  update(data: this | any, options?: SaveOptions): Promise<this> {
    for (const [key, value] of Object.entries(data)) {
      if (key in this) {
        this[key] = value;
      }

      // monkey patch update eager
      const isFK = key.slice(-3) === '_id';
      if (isFK && this[key.slice(0, -3)]) {
        delete this[key.slice(0, -3)];
      }
    }

    return this.save(options);
  }

  removeIfExists(options?: RemoveOptions) {
    return this.hasId() ? this.remove(options) : null;
  }
}
