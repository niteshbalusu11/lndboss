import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import autoRebalanceCommand from '~server/commands/rebalance/auto_rebalance_command';
import { rebalanceScheduleDto } from '~shared/commands.dto';

@Injectable()
export class CronService {
  static createRebalanceCron(args: rebalanceScheduleDto) {
    const job = new CronJob(args.schedule, async () => {
      console.log('scheduled a new cron', args);
      const lnd = await LndService.authenticatedLnd({ node: args.node });

      await autoRebalanceCommand({
        lnd,
        args,
      });
    });

    job.start();
  }
}
