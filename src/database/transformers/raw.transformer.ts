import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class RawTransformer extends TransformerAbstract {
  get availableInclude() {
    return [];
  }

  get defaultInclude() {
    return [];
  }

  transform(entity: any) {
    return entity;
  }
}
