import { BaseEntity } from '@db/entities/base/base';
import { Media } from '@db/entities/core/media.entity';
import {
  Column,
  CoreEntity,
  DateTimeColumn,
  EmailColumn,
  NotNullColumn,
  PhoneColumn,
  StatusColumn,
} from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { OneToOne } from 'typeorm';

export enum EmployeeStatus {
  Verify = 'verify',
  Active = 'active',
  Inactive = 'inactive',
}

export enum EmployeeRole {
  Owner = 'owner',
  Cashier = 'cashier',
  Waiter = 'waiter',
}

@CoreEntity()
export class Employee extends BaseEntity {
  @NotNullColumn()
  name: string;

  @PhoneColumn({ nullable: false })
  phone: string;

  @EmailColumn({ nullable: true })
  email: string;

  @NotNullColumn()
  role: EmployeeRole;

  @Exclude()
  @NotNullColumn()
  password: string;

  @Exclude()
  @Column()
  reset_token: string;

  @Exclude()
  @Column()
  verification_token: string;

  @DateTimeColumn()
  verified_at: Date;

  @StatusColumn()
  status: EmployeeStatus;

  @Exclude()
  @OneToOne(() => Media, (media) => media.employee)
  image: Promise<Media>;

  get isVerified() {
    return this.verified_at !== null;
  }

  get isActive() {
    return this.status === EmployeeStatus.Active;
  }

  get isValid() {
    return this.isVerified && this.isActive;
  }

  async getAvatar() {
    const media = await this.image;
    return media ? media.url : null;
  }
}
