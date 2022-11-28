import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { joinGroupChannel } from 'paid-services';

/** Join a channel group
  {
    code: <Group Invite Code String>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    max_rate: <Max Opening Chain Fee Tokens Per VByte Fee Rate Number>
  }
  @returns via cbk or Promise
  {
    transaction_id: <Channel Funding Transaction Id Hex String>
  }
*/

type Args = {
  args: types.commandJoinChannelGroup;
  lnd: AuthenticatedLnd;
  logger: Logger;
};
const joinChannelGroupCommand = async ({ args, lnd, logger }: Args) => {
  const result = await joinGroupChannel({
    lnd,
    logger,
    code: args.code,
    max_rate: args.max_rate,
  });

  return { result };
};

export default joinChannelGroupCommand;
