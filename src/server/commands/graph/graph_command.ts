import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
import { Logger as LoggerType } from 'winston';
import { getGraphEntry } from 'balanceofsatoshis/network';
import { httpLogger } from '~server/utils/global_functions';
import { readFile } from 'fs';

const parseAnsi = (n: string) =>
  n.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

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
    rows: string[];
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

    const rows = result.rows.map((row: string[], index: number) => {
      if (index > 0) {
        return row.map((n: string, i: number) => {
          if (i === 3) {
            return parseAnsi(n);
          }

          return n;
        });
      }

      return row;
    });

    return { result: rows };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

export default graphCommand;
