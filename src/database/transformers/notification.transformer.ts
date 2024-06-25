import { Notification } from '@db/entities/core/notification.entity';
import { TransformerAbstract } from '@lib/transformer/abstract.transformer';

export class NotificationTransformer extends TransformerAbstract {
  transform(entity: Notification) {
    return entity.toJSON();
  }
}
