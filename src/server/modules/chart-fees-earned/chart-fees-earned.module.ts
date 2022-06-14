import { ChartFeesEarnedController } from './chart-fees-earned.controller';
import { ChartFeesEarnedService } from './chart-fees-earned.service';
import { Module } from '@nestjs/common';

// Chart Fees Earned Module: Module for the chart fees earned service

@Module({
  providers: [ChartFeesEarnedService],
  controllers: [ChartFeesEarnedController],
})
export class ChartFeesEarnedModule {}
