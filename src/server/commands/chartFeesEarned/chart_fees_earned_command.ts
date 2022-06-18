import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getFeesChart } from 'balanceofsatoshis/routing';
import { logger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get data for fees chart

  {
    days: <Fees Earned Over Days Count Number>
    is_count: <Return Only Count of Forwards Bool>
    lnds: [<Authenticated LND API Object>]
    [via]: <Via Public Key Hex or Tag Id or Alias String>
  }

  @returns via Promise
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

const chartFeesEarnedCommand = async (
  args: types.commandChartFeesEarned,
  lnd: AuthenticatedLnd[]
): Promise<{ result: any }> => {
  try {
    const result = await getFeesChart({
      days: args.days,
      fs: { getFile: readFile },
      is_count: args.is_count,
      is_forwarded: args.is_forwarded,
      lnds: lnd,
      via: args.via || undefined,
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default chartFeesEarnedCommand;
