import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    console.log('Message received: ' + client.id);
    this.server.emit('msgToClient', payload);
  }

  afterInit() {
    console.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
  }

  handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id);
  }
}
