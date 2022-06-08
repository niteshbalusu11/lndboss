import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
