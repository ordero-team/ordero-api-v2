import { SerializerAbstract } from '@lib/transformer/serializers/abstract.serializer';

export class PlainSerializer extends SerializerAbstract {
  /**
   * Serialize a collection of data
   * The PlainSerializer will just return the data without modification
   *
   * @param {Array} data
   */
  async collection(data) {
    return data;
  }

  /**
   * Serialize a single item
   * The PlainSerializer will return the the data without modification
   *
   * @param {*} data
   */
  async item(data) {
    return data;
  }

  /**
   * Serialize a null value
   */
  async null() {
    return null;
  }

  /**
   * Serialize a meta object
   *
   * @param {Object} meta
   */
  async meta(meta) {
    return { meta };
  }

  /**
   * Serialize the pagination meta data
   *
   * @param {Object} pagination
   */
  async paginator(pagination) {
    return { pagination };
  }
}
