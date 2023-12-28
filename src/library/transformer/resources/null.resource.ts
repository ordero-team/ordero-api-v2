import { ResourceAbstract } from '@lib/transformer/resources/abstract.resource';

export class Null extends ResourceAbstract {
  /**
   * Overwrite the constructor and set data and transformer to null
   */
  constructor() {
    super(null, null);
  }

  /**
   * Returns null, a NullResource always returns null
   */
  getData() {
    return null;
  }
}
