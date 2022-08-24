import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getChainFeesChart } from 'balanceofsatoshis/routing';
import { httpLogger } from '~server/utils/global_functions';

/** Get Blockchain fees paid

  {
    days: <Chain Fees Paid Over Days Count Number>
    [end_date]: <End Date YYYY-MM-DD String>
    is_monochrome: <Omit Colors Bool>
    lnds: [<Authenticated LND API Object>]
    request: <Request Function>
    [start_date]: <Start Date YYYY-MM-DD String>
  }

  @returns via Promise
  {
    data: [<Chain Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

type Args = {
  args: types.commandChartChainFees;
  lnd: AuthenticatedLnd[];
};
const chartChainFeesCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getChainFeesChart({
      request,
      days: args.days,
      end_date: args.end_date || undefined,
      lnds: lnd,
      start_date: args.start_date || undefined,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chartChainFeesCommand;
