import { ClosedController } from './closed.controller';
import { ClosedService } from './closed.service';
import { Module } from '@nestjs/common';

// Closed module: Module for the closed service

@Module({
  controllers: [ClosedController],
  providers: [ClosedService],
})
export class ClosedModule {}
