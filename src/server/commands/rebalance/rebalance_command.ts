import { httpLogger } from '~server/utils/global_functions';
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

const rebalanceCommand = async ({ args, lnd, logger }): Promise<{ result: any }> => {
  const avoidArray = !!args.avoid ? args.avoid.filter((n: string) => !!n) : [];
  const inFiltersArray = !!args.in_filters ? args.in_filters.filter((n: string) => !!n) : [];
  const outFiltersArray = !!args.out_filters ? args.out_filters.filter((n: string) => !!n) : [];

  try {
    const result = await manageRebalance({
      lnd,
      logger,
      avoid: avoidArray,
      fs: { getFile: readFile },
      in_filters: inFiltersArray,
      in_outbound: args.in_outbound || undefined,
      in_through: args.in_through || undefined,
      is_strict_max_fee_rate: args.is_strict_max_fee_rate || undefined,
      max_fee: args.max_fee || 1337,
      max_fee_rate: args.max_fee_rate || 250,
      max_rebalance: args.max_rebalance,
      out_filters: outFiltersArray,
      out_inbound: args.out_inbound || undefined,
      out_through: args.out_through || undefined,
      timeout_minutes: args.timeout_minutes || 5,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default rebalanceCommand;
