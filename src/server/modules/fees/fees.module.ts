import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
import { Module } from '@nestjs/common';

// Module for fees command

@Module({
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
