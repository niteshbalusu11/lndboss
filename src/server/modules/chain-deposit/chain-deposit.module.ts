import { ChainDepositController } from './chain-deposit.controller';
import { ChainDepositService } from './chain-deposit.service';
import { Module } from '@nestjs/common';

// Chain deposit module: Module for the chain deposit service

@Module({
  providers: [ChainDepositService],
  controllers: [ChainDepositController],
})
export class ChainDepositModule {}
