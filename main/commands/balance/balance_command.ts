import { getBalance } from 'balanceofsatoshis/balances';
import * as types from '../../../renderer/types';
import { AuthenticatedLnd } from 'lightning';
const stringify = (data: any) => JSON.stringify(data);

/** Get on-chain and off-chain balances
  {
    lnd: <AuthenticatedLnd>
    [above]: <Number>
    [below]: <Number>
    [is_confirmed]: <Boolean>
    [is_offchain_only]: <Boolean>
    [is_onchain_only]: <Boolean>
  }
  @returns via cbk or Promise
  {
    result: <Balance Object>
    error: <Error String>
  }
*/

const balanceCommand = async (args: types.commandBalance, lnd: AuthenticatedLnd) => {
  try {
    const result = await getBalance({
      lnd,
      above: args.above,
      below: args.below,
      is_confirmed: args.is_confirmed,
      is_offchain_only: args.is_offchain_only,
      is_onchain_only: args.is_onchain_only,
    });
    return { result };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default balanceCommand;
