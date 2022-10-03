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
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';
import updatePolicies from './update_policies';

const feesFile = 'fees.json';
const home = '.bosgui';
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
  readFeesFile: {
    data: object;
  };
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
            throw new Error('AutomatedFees IsNotActive-TurnOn From UserPreferences On Dashboard');
          }

          try {
            const res = parse(result);
            if (!res.automatedFees) {
              throw new Error('AutomatedFees IsNotActive-TurnOn From UserPreferences On Dashboard');
            }

            if (!res.automatedFees.is_enabled) {
              throw new Error('AutomatedFees IsNotActive-TurnOn From UserPreferences On Dashboard');
            }
          } catch (err) {
            throw new Error('AutomatedFeesIsNotActive-TurnOnFromUserPreferencesOnDashboard');
          }

          return true;
        },
      ],

      // Read fees file
      readFeesFile: [
        'readSettingsFile',
        'validate',
        ({}, cbk: any) => {
          const filePath = join(...[homedir(), home, feesFile]);
          readFile(filePath, (err, res) => {
            if (!!err || !res) {
              return cbk([400, 'ExpectedFeesJsonFileToScheduleFeesCommand']);
            }

            try {
              parse(res.toString());
            } catch (err) {
              return cbk([400, 'ExpectedValidFeesJsonFileToScheduleFeesCommand']);
            }

            return cbk(null, { data: parse(res.toString()) });
          });
        },
      ],

      // Get the channels
      getChannels: [
        'readSettingsFile',
        'validate',
        async () => {
          return await getChannels({ lnd });
        },
      ],

      getIcons: ['validate', async () => await getIcons({})],

      // Get the wallet public key
      getPublicKey: [
        'validate',
        async () => {
          return await getIdentity({ lnd });
        },
      ],

      // Get the policies of all channels
      getPolicies: [
        'readSettingsFile',
        'getChannels',
        ({ getChannels }, cbk: any) => {
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
        async ({ getChannels, getIcons, getPolicies, getPublicKey }) => {
          type Config = {
            basefees: string[];
            feerates: string[];
            ids: string[];
            maxhtlcratios: string[];
            parsed_ids: string[];
            ratios: string[];
          };

          return await map(args.config, async (config: Config) => {
            const result = await updatePolicies({
              config,
              getChannels,
              getIcons,
              getPolicies,
              getPublicKey,
              lnd,
            });

            return result;
          });
        },
      ],
    })
  ).updatePolicies;
};

export default scheduledFeesCommand;
