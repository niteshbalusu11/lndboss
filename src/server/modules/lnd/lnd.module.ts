import { Global, Module } from '@nestjs/common';

import { LndService } from './lnd.service';

// Lnd module: Global Module for the Authenticated LND API Object service

@Global()
@Module({
  providers: [LndService],
  exports: [LndService],
})
export class LndModule {}
