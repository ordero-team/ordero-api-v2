import { BasicEntity } from '@db/entities/base/basic';
import { CreateDateColumn, ULID, UpdateDateColumn } from '@lib/typeorm/decorators';
import { monotonic } from '@lib/uid/ulid.library';
import { BeforeInsert } from 'typeorm';

export class BaseEntity extends BasicEntity {
  @ULID()
  id: string;

  // =============== EVENTS ===============
  @BeforeInsert()
  updateDataBase() {
    // update ID only if it's empty
    if (!this.id) {
      this.id = monotonic();
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
