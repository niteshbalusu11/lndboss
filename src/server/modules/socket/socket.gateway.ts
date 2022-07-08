import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BosloggerService } from '../boslogger/boslogger.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private logger: BosloggerService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.logger.log({ message: `Message Received: ${client.id}`, type: 'info' });
    this.server.emit('msgToClient', payload);
  }

  afterInit() {
    this.logger.log({ message: 'Socket Gateway Initialized', type: 'info' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log({ message: `Client disconnected: ${client.id}`, type: 'warn' });
  }

  handleConnection(client: Socket) {
    this.logger.log({ message: `Client connected: ${client.id}`, type: 'info' });
  }
}
