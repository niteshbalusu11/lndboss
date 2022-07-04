import { Global, Module } from '@nestjs/common';

import { CronService } from './cron.service';

// Global module for cron service

@Global()
@Module({
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
