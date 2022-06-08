import { ChainDepositController } from './chain-deposit.controller';
import { ChainDepositService } from './chain-deposit.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChainDepositService],
  controllers: [ChainDepositController],
})
export class ChainDepositModule {}
