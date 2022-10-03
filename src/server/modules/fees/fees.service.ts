import { Logger, createLogger, format, transports } from 'winston';
import { feesDto, feesStrategiesDto } from '~shared/commands.dto';

import { CronService } from '../cron/cron.service';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { feesCommand } from '~server/commands';
import { httpLogger } from '~server/utils/global_functions';
import readFeesFile from '~server/commands/fees/read_fees_file';
import { removeStyling } from '~server/utils/constants';
import saveStrategies from '~server/commands/fees/save_strategies';
import scheduledFeesCommand from '~server/commands/fees/scheduled_fees_command';
import validateStrategies from '~server/commands/fees/validate_strategies';

const { isArray } = Array;

// Fees service: service for bos fees command

@Injectable()
export class FeesService {
  constructor(private cronService: CronService) {}

  // Create logger
  createLogger({}): Logger {
    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'rebalance' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    return logger;
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

  async save(args: feesStrategiesDto) {
    try {
      if (!args.configs || !isArray(args.configs) || !args.configs.length) {
        throw new Error('ExpectedArrayOfConfigsToSaveConfigs');
      }

      await validateStrategies({ configs: args.configs[0] });

      const result = await saveStrategies({ configs: args.configs });

      const lnd = await LndService.authenticatedLnd({ node: args.configs[0].node });

      await scheduledFeesCommand({ lnd, args: args.configs[0] });

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
