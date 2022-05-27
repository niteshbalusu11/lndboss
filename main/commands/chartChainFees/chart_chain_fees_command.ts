import { getChainFeesChart } from 'balanceofsatoshis/routing';
import request from 'balanceofsatoshis/commands/simple_request';
import { AuthenticatedLnd } from 'lightning';
import * as types from '../../../renderer/types';

const stringify = (data: any) => JSON.stringify(data);

const chartChainFeesCommand = async (args: types.commandChartChainFees, lnd: AuthenticatedLnd[]) => {
  try {
    const result = await getChainFeesChart({
      request,
      lnds: lnd,
      days: args.days,
    });

    return { result };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default chartChainFeesCommand;
