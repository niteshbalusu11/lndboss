import { BosloggerService } from '../boslogger/boslogger.service';
import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import autoRebalanceCommand from '~server/commands/rebalance/auto_rebalance_command';
import { httpLogger } from '~server/utils/global_functions';
import { rebalanceScheduleDto } from '~shared/commands.dto';
import scheduledFeesCommand from '~server/commands/fees/scheduled_fees_command';

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

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

type AutoFeeCronArgs = {
  args: {
    node: string;
    message_id: string;
    config: {
      basefees: string[];
      feerates: string[];
      inactivity: string[];
      maxhtlcratios: string[];
      parsed_ids: string[];
      ratios: string[];
    }[];
  };
  schedule: string;
};

type RebalanceCronArgs = {
  args: rebalanceScheduleDto;
  id: string;
};

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry, private logger: BosloggerService) {}

  // Create a cron job for rebalance
  async createRebalanceCron({ args, id }: RebalanceCronArgs) {
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

  // Create cron service for fees
  async createAutoFeesCron({ args, schedule }: AutoFeeCronArgs) {
    this.logger.log({ message: `adding fee cron schedule ${schedule}:\n${stringify(args)}`, type: 'info' });

    const job = new CronJob(schedule, async () => {
      try {
        const lnd = await LndService.authenticatedLnd({ node: args.node });
        await scheduledFeesCommand({
          lnd,
          args,
        });
      } catch (error) {
        httpLogger({ error });
      }
    });

    this.schedulerRegistry.addCronJob(args.message_id, job);
    job.start();
  }

  async getCronJob({ name }: { name: string }) {
    return this.schedulerRegistry.getCronJobs().get(name);
  }

  // Delete a cron job
  async deleteCron({ name }: { name: string }) {
    this.schedulerRegistry.deleteCronJob(name);

    this.logger.log({ message: `deleting cron schedule ${name}`, type: 'warn' });
  }
}
