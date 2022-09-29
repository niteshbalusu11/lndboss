import { getChannels, getFeeRates, getIdentity, getPendingChannels } from 'lightning';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const feesFile = 'fees.json';
const home = '.bosgui';
const { parse } = JSON;

const scheduledFeesCommand = async ({ args, lnd }) => {
  return await auto({
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

    // Get the pending channels
    getPending: [
      'validate',
      async ({}) => {
        return await getPendingChannels({ lnd });
      },
    ],

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
        return getFeeRates({ lnd });
      },
    ],
  });
};

export default scheduledFeesCommand;
