import { ChartChainFeesController } from './chart-chain-fees.controller';
import { ChartChainFeesService } from './chart-chain-fees.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChartChainFeesService],
  controllers: [ChartChainFeesController],
})
export class ChartChainFeesModule {}
