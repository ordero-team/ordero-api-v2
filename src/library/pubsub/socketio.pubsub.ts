import { Server } from 'socket.io';

class SocketIO {
  private socket: Server;

  setSocket(socket: Server) {
    this.socket = socket;
  }

  getSocket() {
    return this.socket;
  }
}
export const SocketIOInstance = new SocketIO();
