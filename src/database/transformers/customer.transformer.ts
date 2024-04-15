import { Customer } from '@db/entities/core/customer.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class CustomerTransformer extends TransformerAbstract {
  transform(entity: Customer) {
    return entity.toJSON();
  }
}
