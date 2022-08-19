import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
import { getChainFees } from 'balanceofsatoshis/chain';
import { httpLogger } from '~server/utils/global_functions';

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

type Args = {
  args: types.commandChainfees;
  lnd: AuthenticatedLnd;
};
const chainfeesCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  try {
    const result = await getChainFees({
      lnd,
      blocks: args.blocks,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chainfeesCommand;
