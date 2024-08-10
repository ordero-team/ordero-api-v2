import { config } from '@lib/helpers/config.helper';
import { isTrue } from '@lib/helpers/utils.helper';
import { SnakeNamingStrategy } from '@lib/typeorm/naming-strategy.library';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const defaultConfigs: TypeOrmModuleOptions = {
  type: 'mysql',
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  timezone: '+00:00',
  entities: [__dirname + '/../database/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/../database/subscribers/**/*.subscriber{.ts,.js}'],
  charset: 'utf8mb4_general_ci',
};

let cache: any = false;
if (isTrue(config.get('REDIS_ENABLED'))) {
  const redis = {
    ssl: config.get('REDIS_SSL', false),
    host: config.get('REDIS_HOST'),
    password: config.get('REDIS_PASSWORD', false),
    port: config.get('REDIS_PORT'),
    db: config.get('REDIS_DATABASE'),
  };

  const redisProto = redis.ssl && isTrue(redis.ssl) ? 'rediss' : 'redis';
  let redisUrl = `${redisProto}://:${redis.password}@${redis.host}:${redis.port}/${redis.db}`;
  if (!redis.password) {
    redisUrl = `${redisProto}://${redis.host}:${redis.port}/${redis.db}`;
  }

  cache = {
    type: 'redis',
    options: {
      url: redisUrl,
      no_ready_check: true,
    },
  };
}

// Production
const production: TypeOrmModuleOptions = {
  ...defaultConfigs,
  logging: false,
  cache,
  replication: {
    master: {
      host: config.get('DATABASE_MASTER_HOST'),
      port: Number(config.get('DATABASE_PORT')),
      username: config.get('DATABASE_USER'),
      password: config.get('DATABASE_PASSWORD'),
      database: config.get('DATABASE_NAME'),
    },
    slaves: [
      {
        host: config.get('DATABASE_SLAVE_HOST'),
        port: Number(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
      },
    ],
  },
};

// Development (Local)
const development: TypeOrmModuleOptions = {
  ...defaultConfigs,
  logging: config.isDebugging(),
  host: config.get('DATABASE_MASTER_HOST'),
  port: Number(config.get('DATABASE_PORT')),
  username: config.get('DATABASE_USER'),
  password: config.get('DATABASE_PASSWORD'),
  database: config.get('DATABASE_NAME'),
};

export const database: TypeOrmModuleOptions = config.isDevelopment() ? development : production;
