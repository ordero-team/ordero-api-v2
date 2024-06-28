import { Notification } from '@db/entities/core/notification.entity';
import { config } from '@lib/helpers/config.helper';
import { Server } from 'socket.io';
import { SocketIOInstance } from './socketio.pubsub';

export enum PubSubEvent {
  Event = 'event',
  Notification = 'notification',
}

export enum PubSubEventType {
  OwnerCreateStock = 'owner_create_stock',
  OwnerGetTableLabel = 'owner_get_table_label',
  // Customer
  CustomerCreateOrder = 'customer_create_order',
}

export enum PubSubStatus {
  Success = 'success',
  Fail = 'fail',
  Warning = 'warning',
  PartiallySuccess = 'partially_success',
}

export enum PubSubPayloadType {
  Dialog = 'dialog',
  Download = 'download',
  Notification = 'notification',
}

interface IPubSubEventData {
  request_id: string;
  status: PubSubStatus;
  type: PubSubEventType;
  payload?: {
    type: PubSubPayloadType;
    body: any;
  };
  error?: string;
}

interface IPubSubNotificationData {
  request_id: string;
  data?: Notification;
}

export default class Socket {
  private static _instance: Socket;
  public socket: Server;

  private constructor() {
    if (Socket._instance) {
      throw new Error('Error: Instantiation failed: Use Pusher.getInstance() instead of new');
    }

    switch (config.get('SOCKET_TYPE')) {
      case 'socketio': {
        this.socket = SocketIOInstance.getSocket();
        break;
      }
    }
  }

  public static getInstance(): Socket {
    return this._instance || (this._instance = new this());
  }

  notify(channel: string, data: IPubSubNotificationData): Promise<{ request: any; response: any }> {
    switch (config.get('SOCKET_TYPE')) {
      case 'socketio': {
        return new Promise((resolve) => {
          (this.socket as Server).emit(`ordero/${channel}/${PubSubEvent.Notification}`, data as any);

          return resolve(null);
        });
      }
    }
  }

  event(channel: string, data: IPubSubEventData): Promise<{ request: any; response: any }> {
    switch (config.get('SOCKET_TYPE')) {
      case 'socketio': {
        return new Promise((resolve) => {
          (this.socket as Server).emit(`ordero/${channel}/${PubSubEvent.Event}`, data as any);

          return resolve(null);
        });
      }
    }
  }
}
