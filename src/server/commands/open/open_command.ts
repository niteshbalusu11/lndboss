import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger as LoggerType } from 'winston';
import { httpLogger } from '~server/utils/global_functions';
import { interrogate } from 'balanceofsatoshis/commands';
import { openChannels } from 'balanceofsatoshis/peers';
import { readFile } from 'fs';

type Args = {
  args: types.commandOpen;
  lnd: AuthenticatedLnd;
  logger: LoggerType;
};
const openCommand = async ({ args, lnd, logger }: Args) => {
  try {
    console.log(args);
    const result = await openChannels({
      lnd,
      logger,
      request,
      ask: await interrogate({}),
      capacities: args.capacities,
      cooperative_close_addresses: args.cooperative_close_addresses,
      fs: { getFile: readFile },
      gives: args.gives,
      internal_fund_fee_rate: args.internal_fund_fee_rate,
      is_avoiding_broadcast: args.is_avoiding_broadcast || undefined,
      is_external: undefined,
      opening_nodes: [],
      public_keys: args.public_keys,
      set_fee_rates: [],
      types: args.types,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default openCommand;
