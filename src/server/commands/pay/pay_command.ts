import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger as LoggerType } from 'winston';
import { httpLogger } from '~server/utils/global_functions';
import { pay } from 'balanceofsatoshis/network';
import { readFile } from 'fs';

/** Make a payment

  {
    avoid: [<Avoid Forwarding Through String>]
    [in_through]: <Pay In Through Node With Public Key Hex String>
    [is_strict_max_fee]: <Avoid High Fee Routes Boolean>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    max_fee: <Max Fee Tokens Number>
    max_paths: <Maximum Paths Number>
    [message]: <Message String>
    out: [<Out Through Peer With Public Key Hex String>]
    request: <BOLT 11 Payment Request String>
  }

  @Returns via Promise
  {
    [fee]: <Fee Tokens To Destination Number>
    [id]: <Payment Hash Hex String>
    [latency_ms]: <Latency Milliseconds Number>
    [paid]: <Paid Tokens Number>
    [preimage]: <Payment HTLC Preimage Hex String>
    [relays]: [<Relaying Node Public Key Hex String]
    [success]: [<Standard Format Channel Id String>]
  }
*/

type Args = {
  args: types.commandPay;
  logger: LoggerType;
  lnd: AuthenticatedLnd;
};
const payCommand = async ({ args, lnd, logger }: Args): Promise<{ result: any }> => {
  const avoidArray = !!args.avoid ? args.avoid.filter(n => !!n) : [];
  const outArray = !!args.out ? args.out.filter(n => !!n) : [];

  try {
    const result = await pay({
      lnd,
      logger,
      avoid: avoidArray,
      fs: { getFile: readFile },
      in_through: args.in_through,
      is_strict_max_fee: !!args.is_strict_max_fee,
      max_fee: args.max_fee === undefined ? 1337 : args.max_fee,
      max_paths: args.max_paths || 1,
      message: args.message,
      out: outArray,
      request: args.request,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default payCommand;
