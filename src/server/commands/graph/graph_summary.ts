import { GetNodeResult, getNode } from 'lightning';
import { chartAliasForPeer, getIcons } from 'balanceofsatoshis/display';
import { findKey, formatTokens } from 'ln-sync';

import { auto } from 'async';
import { isIP } from 'net';

const displayTokens = tokens => formatTokens({ tokens }).display;
const isClear = sockets => !!sockets.find(n => !!isIP(n.socket.split(':')[0]));
const isLarge = features => !!features.find(n => n.type === 'large_channels');
const isOnion = sockets => !!sockets.find(n => /onion/.test(n.socket));
const parseAnsi = (n: string) =>
  n.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
const uniq = (arr: string[]) => Array.from(new Set(arr));

/** Returns the summary of the graph entry
  {
    fs: <Filesystem Object>,
    lnd: <Authenticated LND Object>,
    query: <Query String>
  }

  @returns via Promise
  {
    id: <Node Public Key String>,
    node: <Node Alias String>,
    capacity: <Node Capacity String>,
    [is_accepting_large_channels]: <Accepting Large Channels Boolean>,
    [is_onion]: <Supports Onion Boolean>,
    [is_clearnet]: <Supports Clearnet Boolean>,
    [is_unconnectable]: <Unconnectable Boolean>,
    peer_count: <Peer Count Number>,
  }
 */

type Tasks = {
  validate: undefined;
  getKey: any;
  getIcons: any;
  key: string;
  getNode: GetNodeResult;
  peerKeys: string[];
  nodeDetails: any;
};

const graphSummary = async ({ args, lnd }): Promise<{ nodeDetails: any }> => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!args.fs) {
        return cbk([400, 'ExpectedFsMethodsToGetGraphEntry']);
      }

      if (!lnd) {
        return cbk([400, 'ExpectedAuthenticatedLndToGetGraphEntry']);
      }

      if (!args.query) {
        return cbk([400, 'ExpectedQueryToGetGraphEntry']);
      }

      return cbk();
    },

    // Get the tagged node icons
    getIcons: ['validate', async ({}) => await getIcons({ fs: args.fs })],

    // Determine the public key to use
    getKey: ['validate', async ({}) => await findKey({ lnd, query: args.query })],

    // Pull out the public key from getKey result
    key: ['getKey', ({ getKey }, cbk) => cbk(null, getKey.public_key)],

    // Get the node details
    getNode: ['key', async ({ key }) => await getNode({ lnd, public_key: key })],

    // Derive the set of keys of the peers of the node
    peerKeys: [
      'getNode',
      'key',
      ({ getNode, key }, cbk) => {
        const peerKeys = getNode.channels
          .filter(({ policies }) => {
            const enabled = policies.filter(n => n.is_disabled !== true);

            return !!enabled.length;
          })
          .map(n => n.policies.find(n => n.public_key !== key).public_key);

        return cbk(null, uniq(peerKeys));
      },
    ],

    // Log the high-level node details
    nodeDetails: [
      'getIcons',
      'getNode',
      'key',
      'peerKeys',
      ({ getIcons, getNode, key, peerKeys }, cbk) => {
        const mainIcons = getIcons.nodes.find(n => n.public_key === key);

        const mainAlias = chartAliasForPeer({
          alias: getNode.alias,
          icons: !!mainIcons ? mainIcons.icons : undefined,
          public_key: key,
        });

        return cbk(null, {
          id: key,
          node: mainAlias.display,
          capacity: parseAnsi(displayTokens(getNode.capacity)),
          is_accepting_large_channels: isLarge(getNode.features) || undefined,
          is_onion: isOnion(getNode.sockets) || undefined,
          is_clearnet: isClear(getNode.sockets) || undefined,
          is_unconnectable: !getNode.sockets.length || undefined,
          peer_count: peerKeys.length,
        });
      },
    ],
  });
};

export default graphSummary;
