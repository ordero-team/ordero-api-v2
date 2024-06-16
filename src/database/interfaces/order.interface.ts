import { OrderStatus } from '@db/entities/core/order.entity';

export interface IOrderItems {
  order_id: string;
  id: string;
  sku?: string;
  name?: string;
  qty: number;
  price: number;
  status?: string;
}

export interface IOrderDetail {
  restaurant_id: string;
  table_id: string;
  location_id?: string;
  reference?: string;
  customer_name: string;
  customer_phone?: string;
  gross_total: number;
  discount: number;
  fee: number;
  net_total: number;
  status: OrderStatus;
  products: IOrderItems[];
  date?: Date;
  note?: string;
  confirm_deadline?: Date;
  cancel_by?: string;
  cancel_reason?: string;
}
