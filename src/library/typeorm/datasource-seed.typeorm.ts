import { database } from '@config/database.config';
import { DataSource } from 'typeorm';

const SeedDataSource = new DataSource({
  ...database,
  migrations: [__dirname + '/../../database/seeds/**/*{.ts,.js}'],
} as any);

export default SeedDataSource;
