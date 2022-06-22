import { Controller, Get, Query } from '@nestjs/common';
import { closedDto } from '~shared/commands.dto';
import { ClosedService } from './closed.service';

// Closed controller: Handles routes to the closed service

@Controller('api/closed')
export class ClosedController {
  constructor(private closedService: ClosedService) {}

  @Get()
  async closed(@Query() args: closedDto) {
    return this.closedService.get(args);
  }
}
