import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getReceivedChart } from 'balanceofsatoshis/wallets';
import { logger } from '~server/utils/global_functions';

/** Get data for received payments chart

  {
    days: <Received Over Days Count Number>
    lnds: [<Authenticated LND API Object>]
  }

  @returns via Promise
  {
    data: [<Received Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

const chartPaymentsReceivedCommand = async (args: types.commandChartPaymentsReceived, lnd: AuthenticatedLnd[]) => {
  try {
    const result = await getReceivedChart({
      lnds: lnd,
      days: args.days,
    });
    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default chartPaymentsReceivedCommand;
