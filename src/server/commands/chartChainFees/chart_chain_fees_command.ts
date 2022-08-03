import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
import { getChainFeesChart } from 'balanceofsatoshis/routing';
import { httpLogger } from '~server/utils/global_functions';

/** Get Blockchain fees paid

  {
    days: <Chain Fees Paid Over Days Count Number>
    is_monochrome: <Omit Colors Bool>
    lnds: [<Authenticated LND API Object>]
    request: <Request Function>
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
      lnds: lnd,
      days: args.days || 60,
    });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

export default chartChainFeesCommand;
