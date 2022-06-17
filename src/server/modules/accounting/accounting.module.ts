import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AccountingService],
  controllers: [AccountingController],
})
export class AccountingModule {}
