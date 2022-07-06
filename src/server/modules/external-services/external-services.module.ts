import { Global, Module } from '@nestjs/common';

import { ExternalServicesService } from './external-services.service';

// Global module for external services

@Global()
@Module({
  providers: [ExternalServicesService],
  exports: [ExternalServicesService],
})
export class ExternalServicesModule {}
