import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, CreateDateColumn, UpdateDateColumn } from '@lib/typeorm/decorators';

@CoreEntity()
export class StaffBlacklist extends BaseEntity {
  @Column({ type: 'text' })
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  static async store(token: string) {
    const blacklist = new StaffBlacklist();
    blacklist.token = token;
    await blacklist.save();
  }
}
