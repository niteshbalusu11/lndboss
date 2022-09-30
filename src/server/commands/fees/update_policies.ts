import { AuthenticatedLnd, GetChannelResult, GetChannelsResult, GetFeeRatesResult, GetIdentityResult } from 'lightning';
import { auto, each, map, retry } from 'async';
import { findKey, updateChannelFee } from 'ln-sync';

import moment from 'moment';

const asTxOut = n => `${n.transaction_id}:${n.transaction_vout}`;
const { ceil } = Math;
const flatten = arr => [].concat(...arr);
const { max } = Math;
const uniq = (arr: string[]) => Array.from(new Set(arr));
const interval = 1000 * 60 * 2;
const times = 360;

type Args = {
  config: {
    basefees: string[];
    feerates: string[];
    maxhtlcratios: string[];
    parsed_ids: string[];
    ratios: string[];
  };
  getChannels: GetChannelsResult;
  getFeeRates: GetFeeRatesResult;
  getIcons: {
    nodes: {
      aliases: string[];
      icons: string[];
      public_key: string[];
    }[];
  };
  getPolicies: GetChannelResult[];
  getPublicKey: GetIdentityResult;
  lnd: AuthenticatedLnd;
};

type Tasks = {
  validate: undefined;
  getPeers: {
    public_key: string;
  }[];
  staticFeesData: any;
  feeUpdate: any;
  updateStaticFees: any;
};
const updatePolicies = async (args: Args) => {
  return await auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      return cbk();
    },

    // Get peers
    getPeers: [
      'validate',
      async () => {
        const { channels } = args.getChannels;

        if (!args.config.parsed_ids.length) {
          const peerKeys = uniq(channels.map(n => n.partner_public_key));
          return peerKeys.map(n => ({ public_key: n }));
        }

        const res = await map(args.config.parsed_ids, async query => {
          const nodes = args.getIcons.nodes.filter(n => n.aliases.includes(query));

          if (!!nodes.length) {
            return nodes.map(n => ({ public_key: n.public_key }));
          }

          return await findKey({ channels, query, lnd: args.lnd });
        });

        return flatten(res);
      },
    ],

    staticFeesData: [
      'getPeers',
      async ({ getPeers }) => {
        if (!!args.config.parsed_ids.length) {
          return;
        }

        const ownKey = args.getPublicKey.public_key;
        const peerKeys = getPeers.map(n => n.public_key).filter(n => !!n);

        return await map(peerKeys, async (key: string) => {
          const channels = [].concat(args.getChannels.channels).filter(channel => channel.partner_public_key === key);

          const feeRates = args.getFeeRates.channels.filter(rate => {
            return channels.find(n => asTxOut(n) === asTxOut(rate));
          });

          const currentPolicies = args.getPolicies
            .filter(n => !!n)
            .filter(n => channels.find(chan => asTxOut(chan) === asTxOut(n)))
            .map(n => n.policies.find(p => p.public_key === ownKey))
            .filter(n => !!n);

          const baseFeeMillitokens = feeRates
            .map(n => BigInt(n.base_fee_mtokens))
            .reduce((sum, fee) => (fee > sum ? fee : sum), BigInt(Number()));

          return channels.map(channel => {
            // Exit early when there is no known policy
            if (!currentPolicies.length) {
              return {
                cltv_delta: undefined,
                fee_rate: undefined,
                transaction_id: channel.transaction_id,
                transaction_vout: channel.transaction_vout,
              };
            }

            // Only the highest CLTV delta across all peer channels applies
            const cltvDelta = max(...currentPolicies.map(n => n.cltv_delta));

            // Only the highest fee rate across all peer channels applies
            const maxFeeRate = max(...currentPolicies.map(n => n.fee_rate));

            return {
              base_fee_mtokens: baseFeeMillitokens.toString(),
              cltv_delta: cltvDelta,
              fee_rate: maxFeeRate,
              transaction_id: channel.transaction_id,
              transaction_vout: channel.transaction_vout,
            };
          });
        });
      },
    ],

    feeUpdate: [
      'getPeers',
      async ({ getPeers }) => {
        if (!args.config.parsed_ids.length) {
          return;
        }

        return;
        // const ownKey = args.getPublicKey.public_key;
        // const peerKeys = getPeers.map(n => n.public_key).filter(n => !!n);

        // return await map(peerKeys, async (key: string) => {
        //   const channels = [].concat(args.getChannels.channels).filter(channel => channel.partner_public_key === key);

        //   const feeRates = args.getFeeRates.channels.filter(rate => {
        //     return channels.find(n => asTxOut(n) === asTxOut(rate));
        //   });

        //   const currentPolicies = args.getPolicies
        //     .filter(n => !!n)
        //     .filter(n => channels.find(chan => asTxOut(chan) === asTxOut(n)))
        //     .map(n => n.policies.find(p => p.public_key === ownKey))
        //     .filter(n => !!n);

        //   const baseFeeMillitokens = feeRates
        //     .map(n => BigInt(n.base_fee_mtokens))
        //     .reduce((sum, fee) => (fee > sum ? fee : sum), BigInt(Number()));

        //   return channels.map(channel => {
        //     // Exit early when there is no known policy
        //     if (!currentPolicies.length) {
        //       return {
        //         cltv_delta: args.cltv_delta,
        //         fee_rate: rate,
        //         transaction_id: channel.transaction_id,
        //         transaction_vout: channel.transaction_vout,
        //       };
        //     }

        //     // Only the highest CLTV delta across all peer channels applies
        //     const cltvDelta = max(...currentPolicies.map(n => n.cltv_delta));

        //     // Only the highest fee rate across all peer channels applies
        //     const maxFeeRate = max(...currentPolicies.map(n => n.fee_rate));

        //     return {
        //       base_fee_mtokens: baseFeeMillitokens.toString(),
        //       cltv_delta: cltvDelta,
        //       fee_rate: rate !== undefined ? rate : maxFeeRate,
        //       transaction_id: channel.transaction_id,
        //       transaction_vout: channel.transaction_vout,
        //     };
        //   });
        // });
      },
    ],

    // Execute fee updates
    updateStaticFees: [
      'staticFeesData',
      ({ staticFeesData }, cbk) => {
        console.log(flatten(staticFeesData));
        if (!staticFeesData) {
          return cbk();
        }

        return each(
          flatten(staticFeesData),
          (update, cbk) => {
            return retry(
              { interval, times },
              cbk => {
                return updateChannelFee(
                  {
                    base_fee_mtokens: update.base_fee_mtokens,
                    cltv_delta: update.cltv_delta,
                    fee_rate: ceil(update.fee_rate),
                    from: args.getPublicKey.public_key,
                    lnd: args.lnd,
                    transaction_id: update.transaction_id,
                    transaction_vout: update.transaction_vout,
                  },
                  err => {
                    if (!!err) {
                      console.log(err);

                      console.log({
                        next_retry: moment().add(interval, 'ms').calendar(),
                      });

                      return cbk(err);
                    }

                    return cbk();
                  }
                );
              },
              cbk
            );
          },
          cbk
        );
      },
    ],
  });
};

export default updatePolicies;
