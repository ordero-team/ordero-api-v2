import { BaseEntity } from '@db/entities/base/base';
import {
  BooleanColumn,
  CoreEntity,
  CreateDateColumn,
  JsonColumn,
  NotNullColumn,
  UpdateDateColumn,
} from '@lib/typeorm/decorators';

@CoreEntity()
export class StaffRole extends BaseEntity {
  @NotNullColumn({ unique: true, length: 100 })
  slug: string;

  @JsonColumn()
  permissions: string[];

  @BooleanColumn()
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
