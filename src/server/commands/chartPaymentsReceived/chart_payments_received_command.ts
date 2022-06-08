import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getReceivedChart } from 'balanceofsatoshis/wallets';

const stringify = (obj: any) => JSON.stringify(obj);

const chartPaymentsReceivedCommand = async (args: types.commandChartPaymentsReceived, lnd: AuthenticatedLnd[]) => {
  try {
    const result = await getReceivedChart({
      lnds: lnd,
      days: args.days,
    });
    return { result };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default chartPaymentsReceivedCommand;
