import { BosloggerService } from '../boslogger/boslogger.service';
import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ambossHealthCheck } from '~server/external_services_utils';
import autoRebalanceCommand from '~server/commands/rebalance/auto_rebalance_command';
import { rebalanceScheduleDto } from '~shared/commands.dto';

const stringify = (n: object) => JSON.stringify(n, null, 2);

/**
  @createRebalanceCron
  {
    args: <RebalanceScheduleDto>,
    id: <Rebalance Invoice ID String>,
  }

  @createAmbossHealthCheckCron
  Creates a cron job for AMBOSS_HEALTH_CHECK (every 30 minutes)
  {
    schedule: <Cron Schedule String>,
  }

  @deleteCron
  {
    name: <CronName/ID to delete String>,
  }
*/

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry, private logger: BosloggerService) {}

  createRebalanceCron({ args, id }: { args: rebalanceScheduleDto; id: string }) {
    this.logger.log({ message: `adding cron schedule ${stringify(args)}`, type: 'info' });

    const job = new CronJob(args.schedule, async () => {
      const lnd = await LndService.authenticatedLnd({ node: args.node });

      await autoRebalanceCommand({
        lnd,
        args,
      });
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  async createAmbossHealthCheckCron({ schedule }: { schedule: string }) {
    this.logger.log({ message: `Adding amboss health check cron ${schedule}`, type: 'info' });
    const id = 'amboss-health-check';

    const job = new CronJob(schedule, async () => {
      await ambossHealthCheck({ logger: this.logger });
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  deleteCron({ name }: { name: string }) {
    this.schedulerRegistry.deleteCronJob(name);

    this.logger.log({ message: `deleting cron schedule ${name}`, type: 'warn' });
  }
}
