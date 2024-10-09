import { database } from '@config/database.config';
import { DataSource as DataTypeORM } from 'typeorm';

export class Datasource {
  private static _instance: Datasource;
  private _dataSource: DataTypeORM;

  private constructor() {
    if (Datasource._instance) {
      throw new Error('Error: Instantiation failed: Use Datasource.getInstance() instead of new');
    }
  }

  public static getInstance(): Datasource {
    return this._instance || (this._instance = new this());
  }

  get datasource() {
    return this._dataSource;
  }

  async initialize() {
    if (!this._dataSource || !this._dataSource.isInitialized) {
      this._dataSource = new DataTypeORM(database as any);
      await this._dataSource.initialize();
    }
    return this._dataSource;
  }

  async destroy() {
    if (this._dataSource && this._dataSource.isInitialized) {
      await this._dataSource.destroy();
      this._dataSource = null;
    }
  }
}

const AppDataSource = Datasource.getInstance().datasource;

export default AppDataSource;
