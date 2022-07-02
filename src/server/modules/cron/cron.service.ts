import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import autoRebalanceCommand from '~server/commands/rebalance/auto_rebalance_command';
import { rebalanceScheduleDto } from '~shared/commands.dto';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  createRebalanceCron({ args, id }: { args: rebalanceScheduleDto; id: string }) {
    console.log('adding cron schedule', args);

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

  deleteCron({ name }: { name: string }) {
    this.schedulerRegistry.deleteCronJob(name);

    console.log('deleted cron schedule', name);
  }
}
