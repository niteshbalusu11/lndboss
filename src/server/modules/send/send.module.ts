import { Module } from '@nestjs/common';
import { SendController } from './send.controller';
import { SendService } from './send.service';

// Send module: Module for the bos send service

@Module({
  controllers: [SendController],
  providers: [SendService],
})
export class SendModule {}
