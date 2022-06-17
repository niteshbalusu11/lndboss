import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { Module } from '@nestjs/common';

// AccountingModule: Module for the accounting service

@Module({
  providers: [AccountingService],
  controllers: [AccountingController],
})
export class AccountingModule {}
