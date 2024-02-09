import { BaseEntity } from '@db/entities/base/base';
import { IMedia, IStorageResponse } from '@db/interfaces/media.interface';
import { File } from '@lib/multer-aws/multer-sharp/multer-sharp';
import { Column, CoreEntity, ForeignColumn, JsonColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { get, snakeCase } from 'lodash';
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

  @Column()
  mime_type: string;

  @JsonColumn()
  file: File;

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

  static async total<T>(entity: T): Promise<number> {
    const klass = snakeCase(get(entity, 'constructor.name', '')).toLowerCase();
    if (klass) {
      return Media.count({ where: { [klass]: entity } });
    }

    return 0;
  }

  static async getPayload(image: IStorageResponse) {
    let originalName = get(image, 'originalname', null);
    if (!originalName) {
      originalName = get(image, 'original.Location', '').split('/').pop();
    }

    let mimeType = get(image, 'mimetype', null);
    if (!mimeType) {
      mimeType = get(image, 'original.mimetype', null);
    }

    return {
      label: originalName,
      mime_type: mimeType,
      url: get(image, 'original.Location', null),
      file: get(image, 'original', {}),
    } as Media;
  }

  static async add<T>(entity: T | any, image: IStorageResponse): Promise<T> {
    const payload = await Media.getPayload(image);
    const klass = snakeCase(get(entity, 'constructor.name', '')).toLowerCase();
    if (klass) {
      const data = Media.create({ ...payload });
      data[`${klass}_id`] = entity.id;
      await data.save();
    }

    // reload entity
    await entity.reload();

    return entity;
  }
}
