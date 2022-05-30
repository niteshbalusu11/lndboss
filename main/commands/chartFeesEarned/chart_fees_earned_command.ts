import { getFeesChart } from 'balanceofsatoshis/routing';
import { AuthenticatedLnd } from 'lightning';
import * as types from '../../../renderer/types';
import { readFile } from 'fs';

const stringify = (data: any) => JSON.stringify(data);

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

const chartFeesEarnedCommand = async (args: types.commandChartFeesEarned, lnd: AuthenticatedLnd[]) => {
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
    return { error: stringify(error) };
  }
};

export default chartFeesEarnedCommand;
