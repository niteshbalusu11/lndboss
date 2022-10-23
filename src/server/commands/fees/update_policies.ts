import { AuthenticatedLnd, GetChannelResult, GetChannelsResult, GetIdentityResult, updateRoutingFees } from 'lightning';
import { auto, each, map, retry } from 'async';

import { findKey } from 'ln-sync';
import moment from 'moment';

const { ceil, max, round } = Math;
const defaultBaseFees = '1000';
const defaultCltvDelta = 40;
const defaultRate = 1;
const div = (a: number, b: number) => (a / b).toFixed(2);
const flatten = arr => [].concat(...arr);
const interval = 1000 * 60 * 2;
const isBetween = (num1: number, num2: number, value: number) => value > num1 && value <= num2;
const maxhtlc = (a: number, b: number) => String(round(a * b * 1000));
const times = 10;
const uniq = (arr: string[]) => Array.from(new Set(arr));

/** Update fee policies
  {
    config: <Saved Fee Config Object>
    getChannels: [<Get Channels Rpc Result Object>]
    getIcons: [<Get Tags and Icons Object>]
    getPolicies: [<Get Channel Policies Rpc Result Object]
    getPublicKey: <Public Key Object>
    lnd: <Authenticated Lnd Object>
  }

  @returns via Promise
 */

type Args = {
  config: {
    basefees: string[];
    feerates: string[];
    maxhtlcratios: string[];
    parsed_ids: string[];
    ratios: string[];
  };
  getChannels: GetChannelsResult;
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
  updateFees: any;
  getUpdateInfo: {
    base_fee_mtokens: string;
    cltv_delta: number;
    fee_rate: number;
    max_htlc_mtokens: string | undefined;
    ratio: string;
    transaction_id: string;
    transaction_vout: number;
  }[];
};
const updatePolicies = async (args: Args) => {
  return (
    await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!args.config) {
          return cbk([400, 'ExpectedConfigToUpdatePolicies']);
        }

        if (!args.getChannels) {
          return cbk([400, 'ExpectedChannelsToUpdatePolicies']);
        }

        if (!args.getIcons) {
          return cbk([400, 'ExpectedTagNamesAndIconsToUpdatePolicies']);
        }

        if (!args.getPublicKey) {
          return cbk([400, 'ExpectedPublicKeyToUpdatePolicies']);
        }

        if (!args.lnd) {
          return cbk([400, 'ExpectedAuthenticatedLndToUpdatePolicies']);
        }

        return cbk();
      },

      // Get peers
      getPeers: [
        'validate',
        ({}, cbk: any) => {
          const { channels } = args.getChannels;

          if (!args.config.parsed_ids.length) {
            const peerKeys = uniq(channels.map(n => n.partner_public_key));
            return cbk(
              null,
              peerKeys.map(n => ({ public_key: n }))
            );
          }

          return map(
            args.config.parsed_ids,
            (query, cbk) => {
              const nodes = args.getIcons.nodes.filter(n => n.aliases.includes(query));

              // Exit early when there is a tag match
              if (!!nodes.length) {
                return cbk(
                  null,
                  nodes.map(n => ({ public_key: n.public_key }))
                );
              }

              return findKey({ channels, query, lnd: args.lnd }, cbk);
            },
            (err, res) => {
              if (!!err) {
                return cbk(err);
              }

              return cbk(null, flatten(res));
            }
          );
        },
      ],

      // Get info needed to update fee policies
      getUpdateInfo: [
        'getPeers',
        async ({ getPeers }) => {
          const peerKeys = getPeers.map(n => n.public_key).filter(n => !!n);
          const ownKey = args.getPublicKey.public_key;

          const combinedArray = args.config.ratios.map((ratio, i) => {
            return {
              ratio,
              basefees: !!args.config.basefees.length ? args.config.basefees[i] : undefined,
              feerate: !!args.config.feerates.length ? Number(args.config.feerates[i]) : undefined,
              maxhtlcratio: !!args.config.maxhtlcratios.length ? Number(args.config.maxhtlcratios[i]) : undefined,
            };
          });

          const currentPolicies = args.getPolicies
            .filter(n => !!n)
            .map(n => n.policies.find(p => p.public_key === ownKey))
            .filter(n => !!n);

          const cltvDelta = max(...currentPolicies.map(n => n.cltv_delta));

          const res = await map(combinedArray, async ({ ratio, basefees, feerate, maxhtlcratio }) => {
            const getBetweenChannels = await map(peerKeys, async (key: string) => {
              const channels = args.getChannels.channels
                .filter(channel => channel.partner_public_key === key)
                .filter(channel => {
                  const [a, b] = ratio.split('-');

                  const outboundCapacityRatio = div(channel.local_balance, channel.capacity);

                  return isBetween(Number(a), Number(b), Number(outboundCapacityRatio));
                })
                .filter(n => !!n)
                .map(n => ({
                  ratio,
                  base_fee_mtokens: basefees || defaultBaseFees,
                  cltv_delta: cltvDelta || defaultCltvDelta,
                  fee_rate: feerate === undefined ? defaultRate : feerate,
                  max_htlc_mtokens: !!maxhtlcratio ? maxhtlc(n.capacity, maxhtlcratio) : undefined,
                  transaction_id: n.transaction_id,
                  transaction_vout: n.transaction_vout,
                }));

              return channels;
            });

            return flatten(getBetweenChannels);
          });

          return flatten(res.filter(n => !!n.length));
        },
      ],

      // Execute fee updates
      updateFees: [
        'getUpdateInfo',
        ({ getUpdateInfo }, cbk: any) => {
          if (!getUpdateInfo || !getUpdateInfo.length) {
            return cbk();
          }

          return each(
            getUpdateInfo,
            (update, cbk: any) => {
              return retry(
                { interval, times },
                cbk => {
                  return updateRoutingFees(
                    {
                      base_fee_mtokens: update.base_fee_mtokens,
                      cltv_delta: update.cltv_delta,
                      fee_rate: ceil(update.fee_rate),
                      lnd: args.lnd,
                      max_htlc_mtokens: update.max_htlc_mtokens,
                      transaction_id: update.transaction_id,
                      transaction_vout: update.transaction_vout,
                    },
                    (err: any) => {
                      if (!!err) {
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
    })
  ).updateFees;
};

export default updatePolicies;
