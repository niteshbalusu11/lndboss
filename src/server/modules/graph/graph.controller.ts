import { Controller, Get, Query } from '@nestjs/common';
import { graphDto } from '~shared/commands.dto';
import { GraphService } from './graph.service';

// Graph Controller: Defines routes for graph command

@Controller('api/graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  async graph(@Query() args: graphDto) {
    return this.graphService.getGraphEntry(args);
  }
}
