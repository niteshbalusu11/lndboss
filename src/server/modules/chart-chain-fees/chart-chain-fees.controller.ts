import { Controller, Get, Query } from '@nestjs/common';
import { chartChainFeesDto } from '~shared/commands.dto';

import { ChartChainFeesService } from './chart-chain-fees.service';

// ChartChainFees Controller: Defines routes for chart-chain-fees command

@Controller('api/chart-chain-fees')
export class ChartChainFeesController {
  constructor(private chartChainFeesService: ChartChainFeesService) {}

  @Get()
  async chartChainFees(@Query() args: chartChainFeesDto) {
    return this.chartChainFeesService.get(args);
  }
}
