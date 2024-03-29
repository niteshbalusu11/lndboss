import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getFeesPaid } from 'balanceofsatoshis/routing';
import { httpLogger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get routing fees paid

  {
    [days]: <Fees Earned Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    [in]: <In Node Public Key or Alias String>
    [is_most_fees_table]: <Is Most Fees Table Bool>
    [is_most_forwarded_table]: <Is Most Forwarded Bool>
    [is_network]: <Show Only Non-Peers In Table Bool>
    [is_peer]: <Show Only Peers In Table Bool>
    lnds: [<Authenticated LND API Object>]
    [out]: <Out Node Public Key or Alias String>
    [start_date]: <Start Date YYYY-MM-DD String>
  }

  @returns via Promise
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

type Args = {
  args: types.commandChartFeesPaid;
  lnd: AuthenticatedLnd[];
};
const chartFeesPaidCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getFeesPaid({
      days: args.days,
      end_date: args.end_date || undefined,
      fs: { getFile: readFile },
      in: args.in || undefined,
      is_most_fees_table: args.is_most_fees_table || undefined,
      is_most_forwarded_table: args.is_most_forwarded_table || undefined,
      is_network: args.is_network || undefined,
      is_peer: args.is_peer || undefined,
      is_rebalances_only: args.is_rebalances_only || undefined,
      lnds: lnd,
      out: args.out || undefined,
      start_date: args.start_date || undefined,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chartFeesPaidCommand;
