import { ChainfeesController } from './chainfees.controller';
import { ChainfeesService } from './chainfees.service';
import { Module } from '@nestjs/common';

// Chainfees module: Module for the chainfees service

@Module({
  controllers: [ChainfeesController],
  providers: [ChainfeesService],
})
export class ChainfeesModule {}
