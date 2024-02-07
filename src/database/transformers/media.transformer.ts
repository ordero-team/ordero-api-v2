import { Media } from '@db/entities/core/media.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class MediaTransformer extends TransformerAbstract {
  transform(entity: Media) {
    return Media.getImage(entity);
  }
}
