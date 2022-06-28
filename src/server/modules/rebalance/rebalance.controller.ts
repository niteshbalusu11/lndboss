import { Controller, Get, Query } from '@nestjs/common';
import { rebalanceDto } from '~shared/commands.dto';
import { RebalanceService } from './rebalance.service';

// Rebalance controller: Defines routes for rebalance command

@Controller('api/rebalance')
export class RebalanceController {
  constructor(private rebalanceService: RebalanceService) {}

  @Get()
  async rebalance(@Query() args: rebalanceDto) {
    return this.rebalanceService.rebalance(args);
  }
}
