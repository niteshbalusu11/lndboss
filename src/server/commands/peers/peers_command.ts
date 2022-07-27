import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from '@nestjs/common';
import { getPeers } from 'balanceofsatoshis/network';
import { httpLogger } from '~server/utils/global_functions';
import { readFile } from 'fs';

/** Get channel-connected peers

  {
    [earnings_days]: <Routing Fee Earnings Days Number>
    [filters]: [<Formula Expression String>]
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [idle_days]: <Not Active For Days Number>
    [is_active]: <Active Channels Only Bool>
    [is_offline]: <Offline Channels Only Bool>
    [is_private]: <Private Channels Only Bool>
    [is_public]: <Public Channels Only Bool>
    [is_table]: <Peers As Table Bool>
    lnd: <Authenticated LND gRPC API Object>
    omit: [<Omit Peer With Public Key Hex String>]
    [sort_by]: <Sort Results By Attribute String>
    [tags]: [<Tag Identifier String>]
  }

  @returns via Promise
  {
    peers: [{
      alias: <Node Alias String>
      [fee_earnings]: <Fees Earned Via Peer Tokens Number>
      first_connected: <Oldest Channel With Peer String>
      [last_activity]: <Last Activity String>
      inbound_fee_rate: <Inbound Fee Rate String>
      inbound_liquidity: <Inbound Liquidity Amount Number>
      outbound_liquidity: <Outbound Liquidity Amount Number>
      public_key: <Public Key Hex String>
    }]
  }
*/

type Args = {
  args: types.commandPeers;
  lnd: AuthenticatedLnd;
};
type Result = {
  result: {
    peers: {
      alias: string;
      fee_earnings?: number;
      first_connected: string;
      last_activity?: string;
      inbound_fee_rate: string;
      inbound_liquidity: number;
      outbound_liquidity: number;
      public_key: string;
    };
  };
};
const peersCommand = async ({ args, lnd }: Args): Promise<{ result: Result }> => {
  try {
    const result = await getPeers({
      lnd,
      earnings_days: args.earnings_days,
      filters: !!args.filters ? args.filters.filter(n => !!n) : [],
      fs: { getFile: readFile },
      idle_days: args.idle_days,
      is_active: args.is_active,
      is_offline: args.is_offline,
      is_private: args.is_private,
      is_public: args.is_public,
      is_table: args.is_table !== false,
      omit: !!args.omit ? args.omit.filter(n => !!n) : [],
      sort_by: args.sort_by,
      tags: !!args.tags ? args.tags.filter(n => !!n) : [],
    });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

export default peersCommand;
