import {
  AuthenticatedLnd,
  GetChannelResult,
  GetChannelsResult,
  GetFeeRatesResult,
  GetIdentityResult,
  getChannel,
  getChannels,
  getFeeRates,
  getIdentity,
} from 'lightning';
import { auto, each, map } from 'async';

import getIcons from '../tags/get_icons';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';
import updatePolicies from './update_policies';

const feesFile = 'fees.json';
const home = '.bosgui';
const { parse } = JSON;
const { isArray } = Array;

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
  getFeeRates: GetFeeRatesResult;
  getPolicies: GetChannelResult[];
  updatePolicies: any;
};

const scheduledFeesCommand = async ({ args, lnd }: Args) => {
  return (
    await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        return cbk();
      },

      // Read fees file
      readFeesFile: [
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

      // Get the current fee rates
      getFeeRates: [
        'validate',
        async () => {
          return await getFeeRates({ lnd });
        },
      ],

      // Get the policies of all channels
      getPolicies: [
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

      updatePolicies: [
        'getChannels',
        'getFeeRates',
        'getIcons',
        'getPolicies',
        'getPublicKey',
        async ({ getChannels, getFeeRates, getIcons, getPolicies, getPublicKey }) => {
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
              getFeeRates,
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
