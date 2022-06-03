import { getReceivedChart } from 'balanceofsatoshis/wallets';
import { AuthenticatedLnd } from 'lightning';
import * as types from '../../../renderer/types';
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
