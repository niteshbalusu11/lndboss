import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Module } from '@nestjs/common';

// Balance module: Module for the balance service

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
