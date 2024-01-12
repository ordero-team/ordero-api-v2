import { BaseEntity } from '@db/entities/base/base';
import { IMedia } from '@db/interfaces/media.interface';
import { Column, CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Owner } from '../owner/owner.entity';
import { Product } from '../owner/product.entity';
import { Restaurant } from '../owner/restaurant.entity';
import { StaffUser } from '../staff/user.entity';

@CoreEntity()
export class Media extends BaseEntity {
  @Column()
  label?: string;

  @Column()
  url: string;

  @Exclude()
  @ForeignColumn()
  owner_id: string;

  @JoinColumn()
  @OneToOne(() => Owner, { onDelete: 'CASCADE' })
  owner: Owner;

  @Exclude()
  @ForeignColumn()
  staff_user_id: string;

  @JoinColumn()
  @OneToOne(() => StaffUser, { onDelete: 'CASCADE' })
  staff_user: StaffUser;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images)
  restaurant: Restaurant;

  @Exclude()
  @ForeignColumn()
  product_id: string;

  @JoinColumn()
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  static getImage(media: Media): IMedia {
    if (!media) {
      return null;
    }

    return {
      id: media.id,
      original: media.url,
    };
  }
}
