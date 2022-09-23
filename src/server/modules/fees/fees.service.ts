import { Logger, createLogger, format, transports } from 'winston';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { feesCommand } from '~server/commands';
import { feesDto } from '~shared/commands.dto';
import { httpLogger } from '~server/utils/global_functions';
import { removeStyling } from '~server/utils/constants';

// Fees service: service for bos fees command

@Injectable()
export class FeesService {
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
}
