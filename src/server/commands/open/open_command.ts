import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger as LoggerType } from 'winston';
import { httpLogger } from '~server/utils/global_functions';
import { interrogate } from 'balanceofsatoshis/commands';
import { openChannels } from 'balanceofsatoshis/peers';
import { readFile } from 'fs';

/** Open channels with peers

  {
    capacities: [<New Channel Capacity Tokens String>]
    cooperative_close_addresses: [<Cooperative Close Address>]
    gives: [<New Channel Give Tokens Number>]
    [is_avoiding_broadcast]: <Avoid Funding Transaction Broadcast Bool>
    [is_external]: <Use External Funds to Open Channels Bool>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    opening_nodes: [<Open New Channel With Saved Node Name String>]
    public_keys: [<Public Key Hex String>]
    request: <Request Function>
    types: [<Channel Type String>]
  }

  @returns via Promise
  {
    transaction_id: <Open Channels Transaction Id Hex String>
    transaction: <Open Channels Raw Transaction Id String>
  }
*/
type Args = {
  args: types.commandOpen;
  lnd: AuthenticatedLnd;
  logger: LoggerType;
};
const openCommand = async ({ args, lnd, logger }: Args) => {
  try {
    const result = await openChannels({
      lnd,
      logger,
      request,
      ask: await interrogate({}),
      capacities: args.capacities || [],
      cooperative_close_addresses: args.cooperative_close_addresses || [],
      fs: { getFile: readFile },
      gives: args.gives || [],
      internal_fund_fee_rate: args.internal_fund_fee_rate || undefined,
      is_avoiding_broadcast: args.is_avoiding_broadcast || undefined,
      is_external: undefined,
      opening_nodes: [],
      public_keys: args.public_keys,
      set_fee_rates: [],
      types: args.types || [],
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default openCommand;
