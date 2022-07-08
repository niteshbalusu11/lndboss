import * as request from 'balanceofsatoshis/commands/simple_request';

import { AuthenticatedLnd } from 'lightning';
import { commandClosed } from '~shared/types';
import { getChannelCloses } from 'balanceofsatoshis/chain';
import { httpLogger } from '~server/utils/global_functions';

/** Get the last channel close outcomes

  {
    [limit]: <Limit Number>
    lnd: <Authenticated LND API Object>
    request: <Request Function>
  }

  @returns via Promise
  {
    peer_public_key: <Peer Public Key Hex String>
    [peer_alias]: <Peer Alias Strring>
    [is_local_force_close]: <Channel Was Locally Force Closed Bool>
    [is_cooperative_close]: <Channel Was Cooperatively Closed Bool>
    [is_remote_force_close]: <Channel was Remotely Force Closed Bool>
    [peer_closed_channel]: <Peer Closed the Channel Bool>
    blocks_since_close: <Count of Blocks Since Close Number>
    capacity: <Channel Capacity Tokens Number>
    [channel_id]: <Channel Id String>
    channel_open: <Channel Funding Outpoint String>
    channel_close: <Channel Close Transaction Id Hex String>
    [channel_balance_spend]: <Channel Balance Spent In Tx Id Hex String>
    [channel_resolutions]: [{
      type: <Resolution Type String>
      value: <Value Number>
    }]
    [is_breach_close]: <Channel Was Breach Closed Bool>
    [closing_fee_paid]: <Closing Fees Paid Related To Channel Tokens Number>
  }
*/

const closedCommand = async (args: commandClosed, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    const result = await getChannelCloses({
      lnd,
      request,
      limit: args.limit,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default closedCommand;
