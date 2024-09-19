import { BaseEntity } from '@db/entities/base/base';
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
import { OneToMany } from 'typeorm';
import { Order } from './order.entity';

export enum CustomerStatus {
  Verify = 'verify',
  Active = 'active',
  Inactive = 'inactive',
}

@CoreEntity()
export class Customer extends BaseEntity {
  @NotNullColumn()
  name: string;

  @PhoneColumn({ nullable: false })
  phone: string;

  @EmailColumn({ nullable: true })
  email: string;

  @Exclude()
  @Column()
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
  status: CustomerStatus;

  @Exclude()
  @OneToMany(() => Order, (order) => order.customer)
  orders: Promise<Order[]>;

  get isVerified() {
    return this.verified_at !== null;
  }

  get isActive() {
    return this.status === CustomerStatus.Active;
  }

  get isValid() {
    return this.isVerified && this.isActive;
  }

  get logName() {
    return `${this.name} ${this.email || this.phone ? `<${this.email || this.phone}>` : ''}`;
  }
}
