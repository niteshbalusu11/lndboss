import { ChartFeesEarnedController } from './chart-fees-earned.controller';
import { ChartFeesEarnedService } from './chart-fees-earned.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChartFeesEarnedService],
  controllers: [ChartFeesEarnedController],
})
export class ChartFeesEarnedModule {}
