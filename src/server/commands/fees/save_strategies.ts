import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const feesFile = 'fees.json';
const home = '.bosgui';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

type Args = {
  data: object;
};

type Tasks = {
  validate: undefined;
  registerHomeDir: undefined;
  writeFile: boolean;
};
const saveStrategies = async ({ data }: Args) => {
  return (
    await auto<Tasks>({
      // check arguments
      validate: (cbk: any) => {
        if (!data) {
          return cbk([400, 'ExpectedFeeStrategyObjectToSaveStrategies']);
        }

        return cbk();
      },

      // Register the home directory
      registerHomeDir: [
        'validate',
        ({}, cbk) => {
          return mkdir(join(...[homedir(), home]), () => {
            // Ignore errors, the directory may already be there
            return cbk();
          });
        },
      ],

      // write the rebalances to file
      writeFile: [
        'registerHomeDir',
        ({}, cbk: any) => {
          const filePath = join(...[homedir(), home, feesFile]);

          writeFile(filePath, stringify(data), err => {
            if (!!err) {
              return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
            }

            return cbk(null, true);
          });
        },
      ],
    })
  ).writeFile;
};

export default saveStrategies;
