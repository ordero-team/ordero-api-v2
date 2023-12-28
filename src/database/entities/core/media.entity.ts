import { BaseEntity } from '@db/entities/base/base';
import { Column, CoreEntity, ForeignColumn } from '@lib/typeorm/decorators';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Employee } from '../owner/employee.entity';
import { Product } from '../owner/product.entity';
import { Restaurant } from '../owner/restaurant.entity';

@CoreEntity()
export class Media extends BaseEntity {
  @Column()
  label?: string;

  @Column()
  url: string;

  @Exclude()
  @ForeignColumn()
  employee_id: string;

  @JoinColumn()
  @OneToOne(() => Employee, { onDelete: 'CASCADE' })
  employee: Employee;

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
}
