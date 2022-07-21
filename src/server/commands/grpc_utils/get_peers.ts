import { AuthenticatedLnd, GetChannelsResult, getChannels } from 'lightning';
import { auto, map } from 'async';

import { getPeerLiquidity } from 'ln-sync';
import { httpLogger } from '~server/utils/global_functions';

const uniq = (n: string[]) => [...new Set(n)];

/** Returns peer liquidity data
  {
    lnd: <AuthenticatedLnd>
  }
  @returns via Promise
  {
    alias: data.alias,
    capacity: data.inbound + data.outbound,
    inbound: data.inbound,
    inbound_opening: data.inbound_opening,
    inbound_pending: data.inbound_pending,
    outbound: data.outbound,
    outbound_opening: data.outbound_opening,
    outbound_pending: data.outbound_pending,
  }
 */

type Tasks = {
  validate: undefined;
  getChannels: GetChannelsResult;
  getLiquidity: {
    alias: string;
    capacity: number;
    inbound: number;
    inbound_opening: number;
    inbound_pending: number;
    outbound: number;
    outbound_opening: number;
    outbound_pending: number;
  };
};

const getPeers = async (lnd: AuthenticatedLnd): Promise<{ result: Tasks }> => {
  try {
    const result = await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!lnd) {
          return cbk([400, 'ExpectedAuthenticatedLnd']);
        }

        return cbk();
      },

      // Get channels
      getChannels: [
        'validate',
        async ({}) => {
          return await getChannels({ lnd });
        },
      ],

      // Get peer liquidity info
      getLiquidity: [
        'getChannels',
        async ({ getChannels }) => {
          // eslint-disable-next-line camelcase
          const pubkeys = uniq(getChannels.channels.map(({ partner_public_key }) => partner_public_key));

          const peerLiquidity = map(pubkeys, async (pubkey: string) => {
            const data = await getPeerLiquidity({ lnd, public_key: pubkey });

            return {
              alias: data.alias,
              capacity: data.inbound + data.outbound,
              inbound: data.inbound,
              inbound_opening: data.inbound_opening,
              inbound_pending: data.inbound_pending,
              outbound: data.outbound,
              outbound_opening: data.outbound_opening,
              outbound_pending: data.outbound_pending,
              public_key: pubkey,
            };
          });

          return peerLiquidity;
        },
      ],
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default getPeers;
