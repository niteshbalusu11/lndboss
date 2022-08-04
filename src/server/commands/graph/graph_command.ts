import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
import { Logger as LoggerType } from 'winston';
import { getGraphEntry } from 'balanceofsatoshis/network';
import { httpLogger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get a graph entry

  {
    filters: [<Filter Expression String>]
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    query: <Graph Query String>
    sort: <Sort By Field String>
  }

  @returns via Promise
  {
    rows: [[<Table Cell String>]]
  }
*/

type Args = {
  args: types.commandGraph;
  lnd: AuthenticatedLnd;
  logger: LoggerType;
};
type Result = {
  result: {
    rows: any[];
  };
};
const graphCommand = async ({ args, lnd, logger }: Args): Promise<{ result: Result }> => {
  try {
    const result = await getGraphEntry({
      lnd,
      logger,
      filters: !!args.filters ? args.filters : [],
      fs: { getFile: readFile },
      query: args.query.trim(),
      sort: args.sort,
    });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

export default graphCommand;
