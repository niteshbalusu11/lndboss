import { Module } from '@nestjs/common';
import { ReconnectController } from './reconnect.controller';
import { ReconnectService } from './reconnect.service';

@Module({
  controllers: [ReconnectController],
  providers: [ReconnectService],
})
export class ReconnectModule {}
