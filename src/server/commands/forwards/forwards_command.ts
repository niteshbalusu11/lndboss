import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getForwards } from 'balanceofsatoshis/network';
import { logger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get recent forwarding activity

  {
    [days]: <Days Number>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [is_monochrome]: <Mute Colors Bool>
    [is_table]: <Return Results As Table Bool>
    lnd: <Authenticated LND API Object>
    [sort]: <Sort By Field String>
  }

  @returns via Promise
  {
    peers: [{
      alias: <Peer Alias String>
      earned_inbound_fees: <Earned Inbound Fee Tokens Number>
      earned_outbound_fees: <Earned Outbound Fee Tokens Number>
      last_inbound_at: <Last Inbound Forward At ISO 8601 Date String>
      last_outbound_at: <Last Forward At ISO 8601 Date String>
      liquidity_inbound: <Inbound Liquidity Big Tokens Number>
      outbound_liquidity: <Outbound Liquidity Big Tokens Number>
      public_key: <Public Key String>
    }]
  }
*/

const forwardsCommand = async (args: types.commandForwards, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    const result = await getForwards({
      lnd,
      days: args.days,
      from: args.from,
      fs: { getFile: readFile },
      sort: args.sort,
      to: args.to,
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default forwardsCommand;
