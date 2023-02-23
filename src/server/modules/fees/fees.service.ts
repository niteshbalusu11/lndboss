import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import { autoFeesCronSchedule, removeStyling } from '~server/utils/constants';
import { feesDto, feesStrategiesDto } from '~shared/commands.dto';

import { CronService } from '../cron/cron.service';
import { LndService } from '../lnd/lnd.service';
import { feesCommand } from '~server/commands';
import { httpLogger } from '~server/utils/global_functions';
import readFeesFile from '~server/commands/fees/read_fees_file';
import saveStrategies from '~server/commands/fees/save_strategies';
import scheduledFeesCommand from '~server/commands/fees/scheduled_fees_command';
import validateStrategies from '~server/commands/fees/validate_strategies';

// Fees service: service for bos fees command

@Injectable()
export class FeesService implements OnModuleInit {
  constructor(private cronService: CronService) {}

  // On module init, get saved nodes and fetch rebalances and add to cron jobs
  async onModuleInit() {
    this.createAutoFeesCron();
  }

  // Create logger
  createLogger({}): Logger {
    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'fees' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    return logger;
  }

  async createAutoFeesCron() {
    try {
      const data = await this.readFeesFile();

      if (!data) {
        return;
      }

      data.configs.forEach(config => {
        this.cronService.createAutoFeesCron({ args: config, schedule: autoFeesCronSchedule });
      });
    } catch (error) {
      httpLogger({ error });
    }
  }

  async feesCommand(args: feesDto) {
    try {
      const lnd = await LndService.authenticatedLnd({ node: args.node });
      const logger = this.createLogger({});

      const { result } = await feesCommand({
        args,
        lnd,
        logger,
      });

      return { result: removeStyling(result) };
    } catch (error) {
      httpLogger({ error });
    }
  }

  async runAutoFees(args: feesStrategiesDto) {
    try {
      const lnd = await LndService.authenticatedLnd({ node: args.configs.node });
      await scheduledFeesCommand({ lnd, args: args.configs });
    } catch (error) {
      httpLogger({ error });
    }
  }

  async save(args: feesStrategiesDto) {
    try {
      await validateStrategies({ configs: args.configs });

      const result = await saveStrategies({ configs: args.configs });

      const getJob = await this.cronService.getCronJob({ name: args.configs.message_id });

      this.runAutoFees(args);

      if (!!getJob) {
        await this.cronService.deleteCron({ name: args.configs.message_id });
        this.cronService.createAutoFeesCron({ args: args.configs, schedule: autoFeesCronSchedule });

        return result;
      }

      this.cronService.createAutoFeesCron({ args: args.configs, schedule: autoFeesCronSchedule });

      return result;
    } catch (error) {
      httpLogger({ error });
    }
  }

  async readFeesFile() {
    try {
      const { data } = await readFeesFile({});
      if (!data) {
        return false;
      }

      return data;
    } catch (error) {
      httpLogger({ error });
    }
  }
}
