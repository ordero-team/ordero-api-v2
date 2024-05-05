import { SocketIOInstance } from '@lib/pubsub/socketio.pubsub';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketioGateway implements OnGatewayInit {
  @WebSocketServer()
  public server: Server;

  afterInit(server: Server) {
    SocketIOInstance.setSocket(server);
  }
}
