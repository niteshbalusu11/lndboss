import { Controller, Get, Query } from '@nestjs/common';
import { chartFeesPaidDto } from '~shared/commands.dto';
import { ChartFeesPaidService } from './chart-fees-paid.service';

@Controller('api/chart-fees-paid')
export class ChartFeesPaidController {
  constructor(private chartFeesPaidService: ChartFeesPaidService) {}

  @Get()
  async chartFeesPaid(@Query() args: chartFeesPaidDto) {
    return this.chartFeesPaidService.get(args);
  }
}
