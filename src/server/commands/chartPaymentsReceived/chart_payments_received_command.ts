import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getReceivedChart } from 'balanceofsatoshis/wallets';
import { httpLogger } from '~server/utils/global_functions';

/** Get data for received payments chart

  {
    [days]: <Received Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    lnds: [<Authenticated LND API Object>]
    [start_date]: <Start Date YYYY-MM-DD String>
  }

  @returns via Promise
  {
    data: [<Received Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

type Args = {
  args: types.commandChartPaymentsReceived;
  lnd: AuthenticatedLnd[];
};
const chartPaymentsReceivedCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getReceivedChart({
      lnds: lnd,
      days: args.days,
      end_date: args.end_date || undefined,
      start_date: args.start_date || undefined,
    });
    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chartPaymentsReceivedCommand;
