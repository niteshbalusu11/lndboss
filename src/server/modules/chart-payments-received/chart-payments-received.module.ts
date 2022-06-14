import { ChartPaymentsReceivedController } from './chart-payments-received.controller';
import { ChartPaymentsReceivedService } from './chart-payments-received.service';
import { Module } from '@nestjs/common';

// ChartPaymentsReceived Module: Module for the chart-payments-received service

@Module({
  providers: [ChartPaymentsReceivedService],
  controllers: [ChartPaymentsReceivedController],
})
export class ChartPaymentsReceivedModule {}
