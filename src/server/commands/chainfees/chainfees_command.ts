import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getChainFees } from 'balanceofsatoshis/chain';
import { logger } from '~server/utils/global_functions';

/** Get chain fees

  Requires that the lnd is built with walletrpc

  {
    [blocks]: <Block Count Number>
    lnd: <Authenticated LND gRPC API Object>
  }

  @returns via Promise
  {
    current_block_hash: <Chain Tip Best Block Hash Hex String>
    fee_by_block_target: {
      $number: <Kvbyte Fee Rate Number>
    }
  }
*/

const chainfeesCommand = async (args: types.commandChainfees, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    const result = await getChainFees({
      lnd,
      blocks: args.blocks,
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default chainfeesCommand;
