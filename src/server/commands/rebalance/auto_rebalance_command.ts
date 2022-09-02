import { createLogger, format, transports } from 'winston';

import { checkScheduledRebalanceSetting } from '~server/settings';
import { manageRebalance } from 'balanceofsatoshis/swaps';
import { readFile } from 'fs';

/** Manage rebalance attempts

  {
    [avoid]: [<Avoid Forwarding Through Node With Public Key Hex String>]
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in_filters]: [<Inbound Filter Formula String>]
    [in_outbound]: <Inbound Target Outbound Liquidity Tokens Number>
    [in_through]: <Pay In Through Peer String>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [max_rebalance]: <Maximum Amount to Rebalance Tokens String>
    message_id: <Emitter Message ID String>
    [node]: <Node Name String>
    [out_filters]: [<Outbound Filter Formula String>]
    [out_inbound]: <Outbound Target Inbound Liquidity Tokens Number>
    [out_through]: <Pay Out Through Peer String>
    [timeout_minutes]: <Deadline To Stop Rebalance Minutes Number>
  }

  @returns via Promise
*/

const autoRebalanceCommand = async ({ args, lnd }) => {
  const isEnabled = await checkScheduledRebalanceSetting();
  if (!isEnabled) {
    return;
  }

  const logger = createLogger({
    level: 'info',
    format: format.combine(format.prettyPrint()),
    defaultMeta: { service: 'rebalance' },
    transports: [
      new transports.Console({
        format: format.combine(format.prettyPrint()),
      }),
    ],
  });

  const avoidArray = args.avoid.filter(n => !!n);
  const inFiltersArray = args.in_filters.filter(n => !!n);
  const outFiltersArray = args.out_filters.filter(n => !!n);

  await manageRebalance({
    lnd,
    logger,
    avoid: avoidArray,
    fs: { getFile: readFile },
    in_filters: inFiltersArray,
    in_outbound: args.in_outbound || undefined,
    in_through: args.in_through || undefined,
    max_fee: args.max_fee || 1337,
    max_fee_rate: args.max_fee_rate || 250,
    max_rebalance: args.max_rebalance,
    out_filters: outFiltersArray,
    out_inbound: args.out_inbound || undefined,
    out_through: args.out_through || undefined,
    timeout_minutes: args.timeout_minutes || 5,
  });
};

export default autoRebalanceCommand;
