import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { createGroupChannel } from 'paid-services';

/** Create a channel group
  {
    capacity: <Channel Capacity Tokens Number>
    count: <Group Member Count Number>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    rate: <Opening Chain Fee Tokens Per VByte Rate Number>
  }
  @returns via Promise
  {
    transaction_id: <Transaction Id Hex String>
  }
*/

type Args = {
  args: types.createGroupChannelCommand;
  lnd: AuthenticatedLnd;
  logger: Logger;
};
const createGroupChannelCommand = async ({ args, lnd, logger }: Args) => {
  const result = await createGroupChannel({
    lnd,
    logger,
    capacity: args.capacity,
    count: args.count,
    rate: args.rate,
  });

  return { result };
};

export default createGroupChannelCommand;
