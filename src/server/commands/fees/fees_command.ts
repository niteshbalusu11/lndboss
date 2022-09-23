import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { adjustFees } from 'balanceofsatoshis/routing';
import { readFile } from 'fs';

/** View and adjust routing fees

  {
    [cltv_delta]: <Set CLTV Delta Number>
    [fee_rate]: <Fee Rate String>
    lnd: <Authenticated LND API Object>
    logger: <Winstone Logger Object>
    to: [<Adjust Routing Fee To Peer Alias or Public Key or Tag String>]
  }

  @returns via cbk or Promise
  {
    rows: [[<Table Cell String>]]
  }
*/
type Args = {
  args: types.commandFees;
  lnd: AuthenticatedLnd;
  logger: Logger;
};
const feesCommand = async ({ args, lnd, logger }: Args) => {
  const toArray = !!args.to ? args.to.filter((n: string) => !!n) : [];

  const result = await adjustFees({
    lnd,
    logger,
    cltv_delta: args.cltv_delta || undefined,
    fee_rate: args.fee_rate,
    fs: { getFile: readFile },
    to: toArray,
  });

  return { result };
};

export default feesCommand;
