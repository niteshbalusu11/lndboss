import { ChartFeesPaidController } from './chart-fees-paid.controller';
import { ChartFeesPaidService } from './chart-fees-paid.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChartFeesPaidService],
  controllers: [ChartFeesPaidController],
})
export class ChartFeesPaidModule {}
