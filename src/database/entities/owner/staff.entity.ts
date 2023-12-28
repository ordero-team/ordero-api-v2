import { BaseEntity } from '@db/entities/base/base';

import { CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { Location } from './location.entity';
import { Restaurant } from './restaurant.entity';

@CoreEntity()
export class Staff extends BaseEntity {
  @Exclude()
  @ForeignColumn()
  employee_id: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  employee: Employee;

  @Exclude()
  @ForeignColumn()
  restaurant_id: string;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @Exclude()
  @ForeignColumn()
  location_id: string;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  location: Location;
}
