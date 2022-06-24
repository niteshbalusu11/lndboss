import { ForwardsController } from './forwards.controller';
import { ForwardsService } from './forwards.service';
import { Module } from '@nestjs/common';

// Forwards Module: Module for the forwards service

@Module({
  controllers: [ForwardsController],
  providers: [ForwardsService],
})
export class ForwardsModule {}
