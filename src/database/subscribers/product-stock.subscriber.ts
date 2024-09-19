import { ProductHistory } from '@db/entities/owner/product-history.entity';
import { ProductStock } from '@db/entities/owner/product-stock.entity';
import { Logger as NestLog } from '@nestjs/common';
import { get } from 'lodash';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class ProductStockSubscriber implements EntitySubscriberInterface<ProductStock> {
  private readonly logger = new NestLog(ProductStockSubscriber.name);
  /**
   * Indicates that this subscriber only listen to below entity events.
   */
  listenTo() {
    return ProductStock;
  }

  calculateStock(entity: ProductStock) {
    const allocated = entity.allocated || 0;
    const onhand = entity.onhand || 0;
    entity.available = onhand <= 0 && allocated <= 0 ? 0 : onhand - allocated;
  }

  /**
   * Called before insertion.
   */
  beforeInsert({ entity }: InsertEvent<ProductStock>) {
    this.calculateStock(entity);
  }

  /**
   * Called before update.
   */
  beforeUpdate({ entity }: UpdateEvent<ProductStock>) {
    if (typeof entity !== 'undefined' && entity instanceof ProductStock) {
      this.calculateStock(entity);
    }
  }

  /**
   * Called after insertion.
   */
  async afterInsert({ entity, manager }: InsertEvent<ProductStock>) {
    // saving history
    if (get(entity, 'last_action', null)) {
      const history = new ProductHistory();
      history.action = entity.last_action;
      history.data = {
        onhand: entity.onhand,
        allocated: entity.allocated,
        available: entity.available,
        sold: entity.sold,
        threshold: entity.threshold,
      };
      history.product_id = entity.product_id;
      history.location_id = entity.location_id;
      history.actor = entity.actor;
      await manager.getRepository(ProductHistory).save(history);

      // reset last action
      await manager.getRepository(ProductStock).update(entity.id, { last_action: null, actor: null });
    }
  }

  async afterUpdate({ entity, manager }: UpdateEvent<ProductStock>) {
    // only allow defined entity
    if (typeof entity !== 'undefined' && entity instanceof ProductStock) {
      await this.afterInsert({ entity, manager } as any);
    }
  }
}
