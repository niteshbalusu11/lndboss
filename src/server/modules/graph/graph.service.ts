import { Logger, createLogger, format, transports } from 'winston';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { graphCommand } from '~server/commands';
import { graphDto } from '~shared/commands.dto';

/** Get a graph entry

  {
    filters: [<Filter Expression String>]
    lnd: <Authenticated LND API Object>
    query: <Graph Query String>
    sort: <Sort By Field String>
  }

  @returns via Promise
  {
    rows: [[<Table Cell String>]]
  }
*/

type Result = {
  result: {
    rows: any[];
  };
};
@Injectable()
export class GraphService {
  async getGraphEntry(args: graphDto): Promise<{ result: Result }> {
    const logger: Logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'graph' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await graphCommand({ args, lnd, logger });

    return { result };
  }
}
