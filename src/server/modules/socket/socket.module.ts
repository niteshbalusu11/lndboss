import { Global, Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';

@Global()
@Module({
  controllers: [],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
