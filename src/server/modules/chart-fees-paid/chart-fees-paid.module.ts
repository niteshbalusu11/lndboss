import { ChartFeesPaidController } from './chart-fees-paid.controller';
import { ChartFeesPaidService } from './chart-fees-paid.service';
import { Module } from '@nestjs/common';

// Chart fees paid module: Module for the chart fees paid service

@Module({
  providers: [ChartFeesPaidService],
  controllers: [ChartFeesPaidController],
})
export class ChartFeesPaidModule {}
