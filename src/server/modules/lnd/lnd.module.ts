import { Global, Module } from '@nestjs/common';

import { LndService } from './lnd.service';

@Global()
@Module({
  providers: [LndService],
  exports: [LndService],
})
export class LndModule {}
