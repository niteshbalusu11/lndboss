import {
  AuthenticatedLnd,
  GetChannelResult,
  GetChannelsResult,
  GetIdentityResult,
  getChannel,
  getChannels,
  getIdentity,
} from 'lightning';
import { auto, map } from 'async';

import getIcons from '../tags/get_icons';
import { getSettingsFile } from '~server/settings';
import updatePolicies from './update_policies';

const { parse } = JSON;
const { isArray } = Array;

/** Execute scheduled fees configs
  {
    configs: [<Fee Strategies Config Object>]
    lnd: <Authenticated Lnd Object>
  }

  @returns via Promise
 */

type Args = {
  args: {
    config: {
      basefees: string[];
      feerates: string[];
      maxhtlcratios: string[];
      parsed_ids: string[];
      ratios: string[];
    }[];
    message_id: string;
    node: string;
  };
  lnd: AuthenticatedLnd;
};

type Tasks = {
  validate: undefined;
  readSettingsFile: boolean | undefined;
  getChannels: GetChannelsResult;
  getIcons: {
    nodes: {
      aliases: string[];
      icons: string[];
      public_key: string[];
    }[];
  };
  getPublicKey: GetIdentityResult;
  getPolicies: GetChannelResult[];
  updatePolicies: any;
};

const scheduledFeesCommand = async ({ args, lnd }: Args) => {
  return (
    await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!args.config) {
          return cbk([400, 'ExpectedConfigToRunScheduledFees']);
        }

        if (!lnd) {
          return cbk([400, 'ExpectedAuthenticatedLndToRunScheduledFees']);
        }

        return cbk();
      },

      readSettingsFile: [
        'validate',
        async () => {
          const result = await getSettingsFile();

          if (!result) {
            return false;
          }

          try {
            const res = parse(result);

            if (!res.automatedFees) {
              return false;
            }

            if (!res.automatedFees.is_enabled) {
              return false;
            }
          } catch (err) {
            return false;
          }

          return true;
        },
      ],

      // Get the channels
      getChannels: [
        'readSettingsFile',
        'validate',
        async ({ readSettingsFile }) => {
          if (!readSettingsFile) {
            return;
          }

          return await getChannels({ lnd });
        },
      ],

      getIcons: [
        'readSettingsFile',
        'validate',
        async ({ readSettingsFile }) => {
          if (!readSettingsFile) {
            return;
          }

          return await getIcons({});
        },
      ],

      // Get the wallet public key
      getPublicKey: [
        'readSettingsFile',
        'validate',
        async ({ readSettingsFile }) => {
          if (!readSettingsFile) {
            return;
          }

          return await getIdentity({ lnd });
        },
      ],

      // Get the policies of all channels
      getPolicies: [
        'readSettingsFile',
        'getChannels',
        ({ getChannels, readSettingsFile }, cbk: any) => {
          if (!readSettingsFile) {
            return cbk();
          }

          return map(
            getChannels.channels,
            (channel, cbk: any) => {
              return getChannel({ lnd, id: channel.id }, (err, res) => {
                if (isArray(err) && err.slice().shift() === 404) {
                  return cbk();
                }

                if (!!err) {
                  return cbk(err);
                }

                // Exit early when the channel policies are not defined
                if (!!res.policies.find(n => n.cltv_delta === undefined)) {
                  return cbk();
                }

                return cbk(null, res);
              });
            },
            cbk
          );
        },
      ],

      // Execute policy updates
      updatePolicies: [
        'getChannels',
        'getIcons',
        'getPolicies',
        'getPublicKey',
        'readSettingsFile',
        async ({ getChannels, getIcons, getPolicies, getPublicKey, readSettingsFile }) => {
          if (!readSettingsFile) {
            return;
          }

          type Config = {
            basefees: string[];
            feerates: string[];
            ids: string[];
            maxhtlcratios: string[];
            parsed_ids: string[];
            ratios: string[];
          };

          return await map(args.config, async (config: Config) => {
            return await updatePolicies({
              config,
              getChannels,
              getIcons,
              getPolicies,
              getPublicKey,
              lnd,
            });
          });
        },
      ],
    })
  ).updatePolicies;
};

export default scheduledFeesCommand;
