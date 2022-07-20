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
  @returns via Promise
  {
    result: {
      postToAmboss: <Boolean>,
    }
  }
 */

@Injectable()
export class ExternalServicesService implements OnModuleInit {
  constructor(private logger: BosloggerService, private cronService: CronService) {}
  async onModuleInit(): Promise<void> {
    if (process.env.AMBOSS_HEALTH_CHECK === 'true') {
      this.pingAmbossHealthCheck({ logger: this.logger });
    }
  }

  async pingAmbossHealthCheck({ logger }) {
    try {
      const result = await ambossHealthCheck({ logger });

      if (!!result.postToAmboss) {
        this.cronService.createAmbossHealthCheckCron({ schedule: ambossHealthCheckCronSchedule });
      }
    } catch (err) {
      this.logger.log({ type: 'error', message: `NoOnlineNodesToStartAmbossHealthCheckCron---SkippingCronJob` });
      throw new Error(err);
    }
  }
}
