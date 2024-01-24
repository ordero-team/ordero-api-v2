import { Table } from '@db/entities/owner/table.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class TableTransformer extends TransformerAbstract {
  transform(entity: Table) {
    return entity.toJSON();
  }
}
