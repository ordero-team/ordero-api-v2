import { BaseEntity } from '@db/entities/base/base';
import {
  BooleanColumn,
  CoreEntity,
  CreateDateColumn,
  DateTimeColumn,
  ForeignColumn,
  JsonColumn,
  UpdateDateColumn,
} from '@lib/typeorm/decorators';
import { Column } from '@lib/typeorm/decorators/column.decorator';
import { Exclude } from 'class-transformer';
import { ManyToOne } from 'typeorm';
import { StaffUser } from './user.entity';

@CoreEntity()
export class StaffSession extends BaseEntity {
  @Column()
  token_id: string;

  @Exclude()
  @BooleanColumn()
  token_deleted: boolean;

  @Column({ length: 25 })
  ip_address: string;

  @Column()
  user_agent: string;

  @JsonColumn()
  raw: any;

  @Exclude()
  @DateTimeColumn()
  logged_out_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @ForeignColumn()
  staff_user_id: string;

  @ManyToOne(() => StaffUser, { onDelete: 'CASCADE' })
  staff_user: StaffUser;
}
