import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { DeepPartial, EntityManager, FindOneOptions, Repository } from 'typeorm';

Repository.prototype.findOrCreate = async function (options?: DeepPartial<any>) {
  let entity = await this.findOne({ where: options || {} });
  if (!entity) {
    entity = this.create(options);
  }

  return entity;
};

Repository.prototype.exists = async function (options?: FindOneOptions<any>) {
  const obj = await this.count(options);

  return obj > 0;
};

export function entityManagerNested<T>(
  cb: (entityManager: EntityManager) => Promise<T>,
  manager?: EntityManager
): Promise<T> {
  if (manager) {
    return cb(manager);
  } else {
    return AppDataSource.transaction(cb);
  }
}
