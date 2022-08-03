import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { Module } from '@nestjs/common';

// Graph Module: Module for graph command

@Module({
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
