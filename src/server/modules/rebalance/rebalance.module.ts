import { Module } from '@nestjs/common';
import { RebalanceController } from './rebalance.controller';
import { RebalanceService } from './rebalance.service';

// Rebalance module: Module for the rebalance command

@Module({
  controllers: [RebalanceController],
  providers: [RebalanceService],
})
export class RebalanceModule {}
