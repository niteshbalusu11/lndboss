import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger as LoggerType } from 'winston';
import { httpLogger } from '~server/utils/global_functions';
import { pushPayment } from 'balanceofsatoshis/network';
import { readFile } from 'fs';

/** Push a payment to a destination

  {
    amount: <Amount to Push Tokens String>
    avoid: [<Avoid Forwarding Through String>]
    destination: <Destination Public Key Hex String>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in_through]: <Pay In Through Peer String>
    [is_dry_run]: <Do Not Push Payment Bool>
    [is_omitting_message_from]: <Do Not Include From Key In Message Bool>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    max_fee: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [message]: <Message to Include With Payment String>
    [out_through]: <Pay Out Through Peer String>
    request: <Request Function>
  }

  @Returns via Promise
  {
    [fee]: <Fee Tokens To Destination Number>
    [id]: <Payment Hash Hex String>
    [latency_ms]: <Latency Milliseconds Number>
    [route_maximum]: <Maximum Sendable Tokens On Successful Probe Path Number>
    [paid]: <Paid Tokens Number>
    [preimage]: <Payment HTLC Preimage Hex String>
    [relays]: [<Relaying Node Public Key Hex String]
    [success]: [<Standard Format Channel Id String>]
  }
*/

type Args = {
  args: types.commandSend;
  logger: LoggerType;
  lnd: AuthenticatedLnd;
};
const sendCommand = async ({ args, lnd, logger }: Args): Promise<{ result: any }> => {
  const avoidArray = !!args.avoid ? args.avoid.filter(n => !!n) : [];

  try {
    const result = await pushPayment({
      lnd,
      logger,
      request,
      amount: args.amount || '1',
      avoid: avoidArray,
      destination: args.destination,
      fs: { getFile: readFile },
      in_through: args.in_through,
      is_dry_run: args.is_dry_run,
      is_omitting_message_from: args.is_omitting_message_from,
      max_fee: args.max_fee || 1337,
      max_fee_rate: args.max_fee_rate || undefined,
      message: args.message,
      quiz_answers: [],
      out_through: args.out_through,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default sendCommand;
