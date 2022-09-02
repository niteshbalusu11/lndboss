import { Injectable, OnModuleInit } from '@nestjs/common';

import { BosloggerService } from '../boslogger/boslogger.service';
import { CronService } from '../cron/cron.service';
import { ambossHealthCheck } from '~server/external_services_utils';

/**
  @onModuleInit
 {
  Check if AMBOSS_HEALTH_CHECK ENV variable is set
  Ping amboss health check
 }

  @pingAmbossHealthCheck
  {
    logger: <BosloggerService>,
  }
 */

@Injectable()
export class ExternalServicesService implements OnModuleInit {
  constructor(private logger: BosloggerService, private cronService: CronService) {}
  async onModuleInit(): Promise<void> {
    this.pingAmbossHealthCheck({ logger: this.logger });
  }

  async pingAmbossHealthCheck({ logger }) {
    try {
      await ambossHealthCheck({ logger });
    } catch (error) {
      logger.log({ type: 'error', message: JSON.stringify(error) });
    }
  }
}
