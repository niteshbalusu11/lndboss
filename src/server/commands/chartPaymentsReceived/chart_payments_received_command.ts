import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getReceivedChart } from 'balanceofsatoshis/wallets';
import { httpLogger } from '~server/utils/global_functions';

/** Get data for received payments chart

  {
    [days]: <Received Over Days Count Number>
    lnds: [<Authenticated LND API Object>]
  }

  @returns via Promise
  {
    data: [<Received Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

const chartPaymentsReceivedCommand = async (
  args: types.commandChartPaymentsReceived,
  lnd: AuthenticatedLnd[]
): Promise<{ result: any }> => {
  try {
    const result = await getReceivedChart({
      lnds: lnd,
      days: args.days || 60,
    });
    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chartPaymentsReceivedCommand;
