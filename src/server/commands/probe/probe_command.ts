import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { findKey } from 'ln-sync';
import { httpLogger } from '~server/utils/global_functions';
import { probe } from 'balanceofsatoshis/network';
import { readFile } from 'fs';

/** Probe a destination, looking for multiple non-overlapping paths

  {
    avoid: [<Avoid Forwarding Through String>]
    [destination]: <Destination Public Key Hex String>
    [find_max]: <Find Maximum Payable On Probed Routes Below Tokens Number>
    [fs]: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in_through]: <Pay In Through Public Key Hex String>
    [is_strict_max_fee]: <Avoid High Fee Routes Boolean>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    [max_paths]: <Maximum Probe Paths Number>
    out: [<Out Through Peer With Public Key Hex String>]
    [request]: <BOLT 11 Encoded Payment Request String>
    [timeout_minutes]: <Stop Searching For Routes After N Minutes Number>
    [tokens]: <Tokens Amount String>
  }

  @returns via Promise
  {
    [fee]: <Total Fee Tokens To Destination Number>
    [latency_ms]: <Latency Milliseconds Number>
    [relays]: [[<Relaying Public Key Hex String>]]
    [routes_maximum]: <Maximum Sendable Tokens on Paths Number>
  }
*/

type Args = {
  args: types.commandProbe;
  lnd: AuthenticatedLnd;
  logger: Logger;
};

type Return = {
  fee: number;
  latency_ms: number;
  relays: string[];
  routes_maximum: number;
};
const probeCommand = async ({ args, lnd, logger }: Args): Promise<{ result: Return }> => {
  try {
    const inThrough = await findKey({ lnd, query: args.in_through });

    const result = await probe({
      lnd,
      logger,
      avoid: !!args.avoid ? args.avoid.filter(n => !!n) : [],
      destination: args.destination.length === 66 ? args.destination : undefined,
      find_max: !!args.find_max ? 16777215 : undefined,
      fs: { getFile: readFile },
      in_through: inThrough.public_key,
      is_strict_max_fee: !!args.is_strict_max_fee,
      max_fee: args.max_fee === undefined ? 1337 : args.max_fee,
      max_paths: args.max_paths || 1,
      out: !!args.out ? args.out.filter(n => !!n) : [],
      request: args.destination.length !== 66 ? args.destination : undefined,
      tokens: args.tokens || undefined,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default probeCommand;
