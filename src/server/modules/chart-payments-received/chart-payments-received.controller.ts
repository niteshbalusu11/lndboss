import { Controller, Get, Query } from '@nestjs/common';
import { chartPaymentsReceivedDto } from '~shared/commands.dto';
import { ChartPaymentsReceivedService } from './chart-payments-received.service';

// ChartPaymentsReceived Controller: Defines routes for chart-payments-received command

@Controller('api/chart-payments-received')
export class ChartPaymentsReceivedController {
  constructor(private chartPaymentsReceivedService: ChartPaymentsReceivedService) {}

  @Get()
  async chartPaymentsReceived(@Query() args: chartPaymentsReceivedDto) {
    return this.chartPaymentsReceivedService.get(args);
  }
}
