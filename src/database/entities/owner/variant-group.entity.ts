import { BaseEntity } from '@db/entities/base/base';
import { BooleanColumn, CoreEntity, ForeignColumn, NotNullColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Variant } from './variant.entity';

export enum VariantGroupType {
  Single = 'single',
  Multiple = 'multiple',
}

@CoreEntity()
export class VariantGroup extends BaseEntity {
  @NotNullColumn()
  name: string;

  @NotNullColumn()
  type: VariantGroupType;

  @BooleanColumn({ default: false })
  required: boolean;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @JoinColumn()
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.variants)
  restaurant: Restaurant;

  @Exclude()
  @OneToMany(() => Variant, (variant) => variant.group)
  variants: Promise<Variant[]>;
}
