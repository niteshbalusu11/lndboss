import { ChartChainFeesController } from './chart-chain-fees.controller';
import { ChartChainFeesService } from './chart-chain-fees.service';
import { Module } from '@nestjs/common';

// ChartChainFees Module: Module for the chart-chain-fees service

@Module({
  providers: [ChartChainFeesService],
  controllers: [ChartChainFeesController],
})
export class ChartChainFeesModule {}
