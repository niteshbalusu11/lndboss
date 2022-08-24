import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getFeesChart } from 'balanceofsatoshis/routing';
import { httpLogger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get data for fees chart

  {
    [days]: <Fees Earned Over Days Count Number>
    [is_count]: <Return Only Count of Forwards Bool>
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

type Args = {
  args: types.commandChartFeesEarned;
  lnd: AuthenticatedLnd[];
};
const chartFeesEarnedCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getFeesChart({
      days: args.days,
      end_date: args.end_date || undefined,
      fs: { getFile: readFile },
      is_count: args.is_count,
      is_forwarded: args.is_forwarded,
      lnds: lnd,
      start_date: args.start_date || undefined,
      via: args.via || undefined,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chartFeesEarnedCommand;
