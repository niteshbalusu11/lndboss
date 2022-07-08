import { Global, Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';

// Module for the NestJS Websockets

@Global()
@Module({
  controllers: [],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
