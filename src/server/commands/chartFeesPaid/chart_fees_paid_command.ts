import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getFeesPaid } from 'balanceofsatoshis/routing';
import { logger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get routing fees paid

  {
    days: <Fees Earned Over Days Count Number>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in]: <In Node Public Key or Alias String>
    [is_most_fees_table]: <Is Most Fees Table Bool>
    [is_most_forwarded_table]: <Is Most Forwarded Bool>
    [is_network]: <Show Only Non-Peers In Table Bool>
    [is_peer]: <Show Only Peers In Table Bool>
    lnds: [<Authenticated LND API Object>]
    [out]: <Out Node Public Key or Alias String>
  }

  @returns via Promise
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

const chartFeesPaidCommand = async (args: types.commandChartFeesPaid, lnd: AuthenticatedLnd[]) => {
  try {
    const result = await getFeesPaid({
      days: args.days,
      fs: { getFile: readFile },
      in: args.in || undefined,
      is_most_fees_table: args.is_most_fees_table || undefined,
      is_most_forwarded_table: args.is_most_forwarded_table || undefined,
      is_network: args.is_network || undefined,
      is_peer: args.is_peer || undefined,
      is_rebalances_only: args.is_rebalances_only || undefined,
      lnds: lnd,
      out: args.out || undefined,
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default chartFeesPaidCommand;
