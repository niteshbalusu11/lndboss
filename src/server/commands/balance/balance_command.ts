import * as types from '../../../shared/types';

import { getBalance, getDetailedBalance } from 'balanceofsatoshis/balances';

import { AuthenticatedLnd } from 'lightning';
import { httpLogger } from '~server/utils/global_functions';

const parseAnsi = (n: string) =>
  n.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

/** Get on-chain and off-chain balances
  {
    lnd: <AuthenticatedLnd>
    [above]: <Number>
    [below]: <Number>
    [is_confirmed]: <Boolean>
    [is_offchain_only]: <Boolean>
    [is_onchain_only]: <Boolean>
  }
  @returns via Promise
  {
    result: <Balance Object>
    error: <Error String>
  }
*/
const balanceCommand = async (args: types.commandBalance, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    if (!!args.is_detailed) {
      const detailed = await getDetailedBalance({
        lnd,
        is_confirmed: args.is_confirmed,
      });

      const result = {
        OnchainBalance: !!detailed.onchain_balance ? parseAnsi(detailed.onchain_balance) : '0',
        OffchainBalance: !!detailed.offchain_balance ? parseAnsi(detailed.offchain_balance) : '0',
        OffchainPending: !!detailed.offchain_pending ? parseAnsi(detailed.offchain_pending) : '0',
        ClosingBalance: !!detailed.closing_balance ? parseAnsi(detailed.closing_balance) : '0',
        ConflictedPending: !!detailed.conflicted_pending ? parseAnsi(detailed.conflicted_pending) : '0',
        InvalidPending: !!detailed.invalid_pending ? parseAnsi(detailed.invalid_pending) : '0',
      };

      return { result };
    }

    const balance = await getBalance({
      lnd,
      above: args.above,
      below: args.below,
      is_confirmed: args.is_confirmed,
      is_offchain_only: args.is_offchain_only,
      is_onchain_only: args.is_onchain_only,
    });

    const result = {
      Balance: balance.balance,
      ChannelBalance: balance.channel_balance,
    };

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default balanceCommand;
