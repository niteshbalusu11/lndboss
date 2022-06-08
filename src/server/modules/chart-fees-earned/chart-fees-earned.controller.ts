import { Controller, Get, Query } from '@nestjs/common';
import { chartFeesEarnedDto } from '~shared/commands.dto';

import { ChartFeesEarnedService } from './chart-fees-earned.service';

@Controller('api/chart-fees-earned')
export class ChartFeesEarnedController {
  constructor(private chartFeesEarnedService: ChartFeesEarnedService) {}

  @Get()
  async chartFeesEarned(@Query() args: chartFeesEarnedDto) {
    return this.chartFeesEarnedService.get(args);
  }
}
