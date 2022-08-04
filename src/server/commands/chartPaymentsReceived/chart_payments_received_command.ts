import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
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

type Args = {
  args: types.commandChartPaymentsReceived;
  lnd: AuthenticatedLnd[];
};
const chartPaymentsReceivedCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getReceivedChart({
      lnds: lnd,
      days: args.days || 60,
    });
    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

export default chartPaymentsReceivedCommand;
