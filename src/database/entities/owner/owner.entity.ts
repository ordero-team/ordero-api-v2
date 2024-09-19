import { BaseEntity } from '@db/entities/base/base';
import { Media } from '@db/entities/core/media.entity';
import {
  Column,
  CoreEntity,
  DateTimeColumn,
  EmailColumn,
  ForeignColumn,
  NotNullColumn,
  PhoneColumn,
  StatusColumn,
} from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../core/order.entity';
import { Role } from '../core/role.entity';
import { Location } from './location.entity';
import { Restaurant } from './restaurant.entity';

export enum OwnerStatus {
  Verify = 'verify',
  Active = 'active',
  Inactive = 'inactive',
}

@CoreEntity()
export class Owner extends BaseEntity {
  @NotNullColumn()
  name: string;

  @PhoneColumn({ nullable: false })
  phone: string;

  @EmailColumn({ nullable: true })
  email: string;

  @Exclude()
  @NotNullColumn()
  password: string;

  @Exclude()
  @Column()
  reset_token: string;

  @Exclude()
  @Column()
  verification_token: string;

  @Exclude()
  @Column()
  verification_code: string;

  @DateTimeColumn()
  verified_at: Date;

  @StatusColumn()
  status: OwnerStatus;

  @DateTimeColumn()
  last_login_at: Date;

  @Exclude()
  @ForeignColumn()
  role_slug: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_slug', referencedColumnName: 'slug' })
  role: Promise<Role>;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @OneToOne(() => Restaurant, { onDelete: 'RESTRICT' })
  restaurant: Promise<Restaurant>;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @ManyToOne(() => Location, { onDelete: 'SET NULL' })
  location: Promise<Location>;

  @Exclude()
  @OneToOne(() => Media, (media) => media.owner)
  image: Promise<Media>;

  @Exclude()
  @OneToMany(() => Order, (order) => order.staff)
  orders: Promise<Order[]>;

  get isVerified() {
    return this.verified_at !== null;
  }

  get isActive() {
    return [OwnerStatus.Active, OwnerStatus.Verify].includes(this.status);
  }

  get isBlocked() {
    return this.status === OwnerStatus.Inactive;
  }

  get isValid() {
    return this.isVerified && this.isActive;
  }

  get logName() {
    return `${this.name} <${this.email || this.phone}>`;
  }

  async getAvatar() {
    const media = await this.image;
    return media ? media.url : null;
  }
}
