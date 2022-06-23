import { FindController } from './find.controller';
import { FindService } from './find.service';
import { Module } from '@nestjs/common';

// Find Module: Module for the balance service

@Module({
  controllers: [FindController],
  providers: [FindService],
})
export class FindModule {}
