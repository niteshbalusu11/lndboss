import * as channelsFromArguments from 'balanceofsatoshis/peers/channels_from_arguments';

import { AuthenticatedLnd, GetWalletVersionResult, addPeer, getNode, getPeers, getWalletVersion } from 'lightning';
import { acceptsChannelOpen, getNetwork } from 'ln-sync';
import { auto, detectSeries, each, eachSeries, map, retry } from 'async';

import { parseAmount } from 'balanceofsatoshis/display';

const flatten = arr => [].concat(...arr);
const { isArray } = Array;
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const knownTypes = ['private', 'private-trusted', 'public', 'public-trusted'];
const notFound = -1;
const per = (a, b) => (a / b).toFixed(2);
const peerAddedDelayMs = 1000 * 5;
const times = 10;
const tokAsBigUnit = tokens => (tokens / 1e8).toFixed(8);
const uniq = arr => Array.from(new Set(arr));

/** Test open channel with peers

  {
    ask: <Ask For Input Function>
    capacities: [<New Channel Capacity Tokens String>]
    cooperative_close_addresses: [<Cooperative Close Address>]
    gives: [<New Channel Give Tokens Number>]
    [is_avoiding_broadcast]: <Avoid Funding Transaction Broadcast Bool>
    [is_external]: <Use External Funds to Open Channels Bool>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    opening_nodes: [<Open New Channel With Saved Node Name String>]
    public_keys: [<Public Key Hex String>]
    request: <Request Function>
    set_fee_rates: [<Fee Rate Number>]
    types: [<Channel Type String>]
  }

  @returns via Promise
  {

  }
*/

type Args = {
  ask: string[];
  capacities: string[];
  cooperative_close_addresses: string[];
  gives: number[];
  internal_fund_fee_rate: number;
  is_avoiding_broadcast: boolean | undefined;
  is_external: boolean | undefined;
  lnd: AuthenticatedLnd;
  logger: any;
  opening_nodes: string[];
  public_keys: string[];
  set_fee_rates: number[];
  types: string[];
};
type Tasks = {
  validate: undefined;
  getLnds: {
    lnd: AuthenticatedLnd;
    node: string;
  }[];
  getNetwork: {
    network: string;
  };
  checkNetworks: any;
  getNodes: {
    alias: string;
    channels_count: number;
    is_accepting_large_channels: boolean | undefined;
    peers_count: number;
    public_key: string;
    sockets: { socket: string }[];
  }[];
  capacities: number[];
  getOpeningNetworks: {
    network: string;
  }[];
  getPeers: any;
  connect: undefined;
  getWalletVersion: GetWalletVersionResult;
  opens: any;
  checkAcceptance: object;
};
const validateOpen = async (args: Args) => {
  // Check arguments
  return (
    await auto<Tasks>({
      validate: (cbk: any) => {
        if (!args.ask) {
          return cbk([400, 'ExpectedAskMethodToValidateOpenChannels']);
        }

        if (!isArray(args.capacities)) {
          return cbk([400, 'ExpectedChannelCapacitiesToValidateOpenChannels']);
        }

        if (!isArray(args.cooperative_close_addresses)) {
          return cbk([400, 'ExpectedCooperativeCloseAddressesArray']);
        }

        if (!isArray(args.gives)) {
          return cbk([400, 'ExpectedArrayOfGivesToValidateOpenChannels']);
        }

        if (!args.lnd) {
          return cbk([400, 'ExpectedLndToInitiateOpenChannelRequests']);
        }

        if (!args.logger) {
          return cbk([400, 'ExpectedLoggerToInitiateOpenChannelRequests']);
        }

        if (!isArray(args.opening_nodes)) {
          return cbk([400, 'ExpectedOpeningNodesArrayToInitiateOpenChannels']);
        }

        if (!isArray(args.public_keys)) {
          return cbk([400, 'ExpectedPublicKeysToValidateOpenChannels']);
        }

        if (!!args.public_keys.filter(n => !isPublicKey(n)).length) {
          return cbk([400, 'NodesToOpenWithMustBeSpecifiedWithPublicKeyOnly']);
        }

        const closeAddrCount = args.cooperative_close_addresses.length;
        const hasCapacities = !!args.capacities.length;
        const hasGives = !!args.gives.length;
        const hasFeeRates = !!args.set_fee_rates.length;
        const hasNodes = !!args.opening_nodes.length;
        const publicKeysLength = args.public_keys.length;

        if (!!hasCapacities && publicKeysLength !== args.capacities.length) {
          return cbk([400, 'CapacitiesMustBeSpecifiedForEveryPublicKey']);
        }

        if (!!closeAddrCount && publicKeysLength !== closeAddrCount) {
          return cbk([400, 'MustSetCoopClosingAddressForEveryPublicKey']);
        }

        if (!!hasGives && publicKeysLength !== args.gives.length) {
          return cbk([400, 'GivesMustBeSpecifiedForEveryPublicKey']);
        }

        if (!!hasFeeRates && publicKeysLength !== args.set_fee_rates.length) {
          return cbk([400, 'MustSetFeeRateForEveryPublicKey']);
        }

        if (!!hasNodes && publicKeysLength !== args.opening_nodes.length) {
          return cbk([400, 'MustSetOpeningNodeForEveryPublicKey']);
        }

        if (!!args.is_external && !!args.internal_fund_fee_rate) {
          return cbk([400, 'CannotUseBothInternalAndExternalFundsForOpen']);
        }

        if (!isArray(args.types)) {
          return cbk([400, 'ExpectedArrayOfTypesToValidateOpenChannels']);
        }

        if (args.types.findIndex(n => !knownTypes.includes(n)) !== notFound) {
          return cbk([400, 'UnknownChannelType', { channel_types: knownTypes }]);
        }

        if (!!args.types.length && args.types.length !== publicKeysLength) {
          return cbk([400, 'ChannelTypesMustBeSpecifiedForEveryPublicKey']);
        }

        return cbk();
      },

      // Parse capacities
      capacities: [
        'validate',
        ({}, cbk: any) => {
          const capacities = args.capacities.map(amount => {
            try {
              return parseAmount({ amount }).tokens;
            } catch (err) {
              return cbk([400, err.message]);
            }
          });

          return cbk(null, capacities);
        },
      ],

      // Get LNDs associated with nodes specified for opening
      getLnds: [
        'validate',
        async ({}) => {
          // Exit early when there are no opening nodes specified
          if (!args.opening_nodes.length) {
            return [{ lnd: args.lnd }];
          }
        },
      ],

      // Get the default network name
      getNetwork: ['validate', ({}, cbk) => getNetwork({ lnd: args.lnd }, cbk)],

      // Get sockets in case we need to connect
      getNodes: [
        'validate',
        ({}, cbk: any) => {
          return map(
            uniq(args.public_keys),
            (key: string, cbk) => {
              return getNode({ lnd: args.lnd, public_key: key }, (err, res) => {
                // Ignore errors when a node is unknown in the graph
                if (!!err) {
                  return cbk(null, { public_key: key, sockets: [] });
                }

                const peers = res.channels.map(({ policies }) => {
                  return policies.find(n => n.public_key !== key).public_key;
                });

                const isBig = res.features.find(n => n.type === 'large_channels');

                return cbk(null, {
                  alias: res.alias,
                  channels_count: res.channels.length,
                  is_accepting_large_channels: !!isBig || undefined,
                  peers_count: uniq(peers).length,
                  public_key: key,
                  sockets: res.sockets,
                });
              });
            },
            cbk
          );
        },
      ],

      // Get the wallet version to make sure the node supports internal funding
      getWalletVersion: [
        'validate',
        ({}, cbk: any) => {
          return getWalletVersion({ lnd: args.lnd }, cbk);
        },
      ],

      // Get the networks of the opening nodes
      getOpeningNetworks: [
        'getLnds',
        ({ getLnds }, cbk) => {
          if (!getLnds) {
            return cbk();
          }

          return map(getLnds, ({ lnd }, cbk) => getNetwork({ lnd }, cbk), cbk);
        },
      ],

      // Get the opening parameters to use to open the new channels
      opens: [
        'capacities',
        ({ capacities }, cbk) => {
          const { opens } = channelsFromArguments({
            capacities,
            addresses: args.cooperative_close_addresses,
            gives: args.gives,
            nodes: args.public_keys,
            rates: args.set_fee_rates,
            saved: args.opening_nodes,
            types: args.types,
          });

          return cbk(null, opens);
        },
      ],

      // Check if all networks are the same
      checkNetworks: [
        'getNetwork',
        'getOpeningNetworks',
        ({ getNetwork, getOpeningNetworks }, cbk: any) => {
          // Exit early when there are no networks to check
          if (!getOpeningNetworks) {
            return cbk();
          }

          if (!!getOpeningNetworks.find(n => n.network !== getNetwork.network)) {
            return cbk([400, 'AllOpeningNodesMustBeOnSameChain']);
          }

          return cbk();
        },
      ],

      // Get connected peers to see if we are already connected
      getPeers: [
        'getLnds',
        ({ getLnds }, cbk: any) => {
          // Exit early when there are no opening nodes
          if (!args.opening_nodes.length) {
            return getPeers({ lnd: args.lnd }, (err, res) => {
              if (!!err) {
                return cbk(err);
              }

              return cbk(null, [{ peers: res.peers }]);
            });
          }

          return map(
            args.opening_nodes,
            (node, cbk: any) => {
              const { lnd } = getLnds.find(n => n.node === node);

              return getPeers({ lnd }, (err, res) => {
                if (!!err) {
                  return cbk(err);
                }

                return cbk(null, { node, peers: res.peers });
              });
            },
            cbk
          );
        },
      ],

      // Connect up to the peers
      connect: [
        'getLnds',
        'getNodes',
        'getPeers',
        'opens',
        ({ getLnds, getNodes, getPeers, opens }, cbk) => {
          // Collect some details about nodes being connected to
          const nodes = getNodes
            .filter(n => !!n.channels_count)
            .map(node => {
              return {
                node: `${node.alias || node.public_key}`,
                channels_per_peer: `${per(node.channels_count, node.peers_count)}`,
                is_accepting_large_channels: node.is_accepting_large_channels,
              };
            });

          args.logger.info(nodes);

          // Connect up as peers
          return each(
            opens,
            ({ node, channels }, cbk) => {
              // Summarize who is being opened to
              const openingTo = getNodes
                .filter(remote => {
                  return !!channels.find(channel => {
                    return channel.partner_public_key === remote.public_key;
                  });
                })
                .map(remote => {
                  const { capacity } = channels.find(channel => {
                    return channel.partner_public_key === remote.public_key;
                  });

                  const remoteNamed = remote.alias || remote.public_key;

                  return `${remoteNamed}: ${tokAsBigUnit(capacity)}`;
                });

              args.logger.info({ node, opening_to: openingTo });

              const connectToKeys = channels.map(n => n.partner_public_key);
              const { lnd } = getLnds.find(n => n.node === node);
              const { peers } = getPeers.find(n => n.node === node);

              return each(
                connectToKeys,
                (key: string, cbk: any) => {
                  // Exit early when the peer is already connected
                  if (peers.map(n => n.public_key).includes(key)) {
                    return cbk();
                  }

                  const to = getNodes.find(n => n.public_key === key);

                  if (!to.sockets.length) {
                    return cbk([503, 'NoAddressFoundToConnectToNode', { to }]);
                  }

                  args.logger.info({
                    connecting_to: { alias: to.alias, public_key: to.public_key },
                    from: node,
                  });

                  return retry(
                    { times },
                    (cbk: any) => {
                      return detectSeries(
                        to.sockets,
                        ({ socket }, cbk: any) => {
                          return addPeer({ lnd, socket, public_key: key }, err => {
                            return cbk(null, !err);
                          });
                        },
                        (err, res) => {
                          if (!!err) {
                            return cbk(err);
                          }

                          if (!res) {
                            return cbk([503, 'FailedToConnectToPeer', { peer: key }]);
                          }

                          return setTimeout(() => cbk(null, true), peerAddedDelayMs);
                        }
                      );
                    },
                    cbk
                  );
                },
                cbk
              );
            },
            cbk
          );
        },
      ],

      // Check all nodes that they will allow an inbound channel
      checkAcceptance: [
        'connect',
        'getLnds',
        'opens',
        ({ getLnds, opens }, cbk) => {
          // Flatten out the opens so that they can be tried serially
          const tests = opens.map(({ channels, node }) => {
            return channels.map(channel => ({
              capacity: channel.capacity,
              cooperative_close_address: channel.cooperative_close_address,
              give_tokens: channel.give_tokens,
              is_private: channel.is_private,
              is_trusted_funding: channel.is_trusted_funding,
              lnd: getLnds.find(n => n.node === node).lnd,
              partner_public_key: channel.partner_public_key,
            }));
          });

          return eachSeries(
            flatten(tests),
            (test, cbk) => {
              return acceptsChannelOpen(
                {
                  capacity: test.capacity,
                  cooperative_close_address: test.cooperative_close_address,
                  give_tokens: test.give_tokens,
                  is_private: test.is_private,
                  is_trusted_funding: test.is_trusted_funding,
                  lnd: test.lnd,
                  partner_public_key: test.partner_public_key,
                },
                cbk
              );
            },
            cbk
          );
        },
      ],
    })
  ).checkAcceptance;
};

export default validateOpen;
