import { Table } from '@db/entities/owner/table.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';
import { LocationTransformer } from './location.transformer';

export class TableTransformer extends TransformerAbstract {
  get availableInclude() {
    return ['location'];
  }

  async includeLocation(entity: Table) {
    const location = await entity.location;
    console.log(`Location => `, location);
    if (!location) {
      return this.null();
    }

    return this.item(location, LocationTransformer);
  }

  transform(entity: Table) {
    return entity.toJSON();
  }
}
