import { ChartPaymentsReceivedController } from './chart-payments-received.controller';
import { ChartPaymentsReceivedService } from './chart-payments-received.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChartPaymentsReceivedService],
  controllers: [ChartPaymentsReceivedController],
})
export class ChartPaymentsReceivedModule {}
