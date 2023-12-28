import { Entity, EntityOptions } from 'typeorm';

interface CoreEntityOptions extends EntityOptions {
  autoIncrement?: number;
}

export function CoreEntity(nameOrOptions?: string | CoreEntityOptions, maybeOptions?: CoreEntityOptions): ClassDecorator {
  const options = (typeof nameOrOptions === 'object' ? (nameOrOptions as CoreEntityOptions) : maybeOptions) || {};
  const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.name;
  const engine = `InnoDB${options.autoIncrement ? ` AUTO_INCREMENT=${options.autoIncrement}` : ''}`;

  return Entity(name, { engine, ...options });
}
