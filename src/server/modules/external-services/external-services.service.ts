import { Injectable, OnModuleInit } from '@nestjs/common';

import { BosloggerService } from '../boslogger/boslogger.service';
import { CronService } from '../cron/cron.service';
import { ambossHealthCheck } from '~server/external_services_utils';
import { ambossHealthCheckCronSchedule } from '~server/utils/constants';

/**
  @onModuleInit
 {
  Check if AMBOSS_HEALTH_CHECK ENV variable is set
  Ping amboss health check
  Add cron job for amboss health check
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
    if (process.env.AMBOSS_HEALTH_CHECK === 'true') {
      await this.pingAmbossHealthCheck({ logger: this.logger });

      await this.cronService.createAmbossHealthCheckCron({ schedule: ambossHealthCheckCronSchedule });
    }
  }

  async pingAmbossHealthCheck({ logger }) {
    await ambossHealthCheck({ logger });
  }
}
