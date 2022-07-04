import { Global, Module } from '@nestjs/common';

import { BosloggerService } from './boslogger.service';

// Global module for logger service

@Global()
@Module({
  providers: [BosloggerService],
  exports: [BosloggerService],
})
export class BosloggerModule {}
