import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import readFeesFile from './read_fees_file';

const feesFile = 'fees.json';
const flatten = arr => [].concat(...arr);
const home = '.bosgui';
const { isArray } = Array;
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Save fee strategies to file
  {
    configs: [<Fee Strategies Config Object>]
    message_id: <Unique Message Id String>
    [node]: <Saved Node String>
  }

  @returns via Promise
  <is_saved Boolean>
 */
type Args = {
  configs: {
    config: {
      basefees: string[];
      feerates: string[];
      ids: string[];
      inactivity: string[];
      maxhtlcratios: string[];
      parsed_ids: string[];
      ratios: string[];
    }[];
    message_id: string;
    node: string;
  };
};

type Tasks = {
  validate: undefined;
  registerHomeDir: undefined;
  readFile: any;
  writeNewFile: boolean;
  updateFile: boolean;
  result: boolean;
};
const saveStrategies = async ({ configs }: Args) => {
  return (
    await auto<Tasks>({
      // check arguments
      validate: (cbk: any) => {
        if (!configs) {
          return cbk([400, 'ExpectedFeeStrategyObjectToSaveStrategies']);
        }

        if (!configs.message_id) {
          return cbk([400, 'ExpectedMessageIdToSaveStrategies']);
        }

        if (configs.node === undefined) {
          return cbk([400, 'ExpectedNodeNameStringToSaveStrategies']);
        }

        if (!isArray(configs.config)) {
          return cbk([400, 'ExpectedArrayOfConfigToSaveStrategies']);
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

      // Read fees file
      readFile: [
        'registerHomeDir',
        async () => {
          const { data } = await readFeesFile({});

          if (!data) {
            return;
          }

          return { data };
        },
      ],

      writeNewFile: [
        'readFile',
        ({ readFile }, cbk: any) => {
          if (!!readFile) {
            return cbk();
          }

          const filePath = join(...[homedir(), home, feesFile]);

          const obj = {
            configs: [configs],
          };

          writeFile(filePath, stringify(obj), err => {
            if (!!err) {
              return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
            }

            return cbk(null, true);
          });
        },
      ],

      // Update file if data is present
      updateFile: [
        'readFile',
        'writeNewFile',
        ({ readFile, writeNewFile }, cbk: any) => {
          if (!!writeNewFile) {
            return cbk();
          }
          const filePath = join(...[homedir(), home, feesFile]);
          const { data } = readFile;

          const findData = data.configs.find(n => n.node === configs.node && n.message_id === configs.message_id);

          if (!findData) {
            const newData = {
              configs: flatten([...data.configs, configs]),
            };

            writeFile(filePath, stringify(newData), err => {
              if (!!err) {
                return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
              }

              return cbk(null, true);
            });
          }

          if (!!findData) {
            const index = data.configs.findIndex(n => n.node === configs.node && n.message_id === configs.message_id);

            data.configs[index] = configs;

            writeFile(filePath, stringify(data), err => {
              if (!!err) {
                return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
              }

              return cbk(null, true);
            });
          }
        },
      ],

      // Return result
      result: [
        'updateFile',
        'writeNewFile',
        ({ updateFile, writeNewFile }, cbk: any) => {
          return cbk(null, updateFile || writeNewFile);
        },
      ],
    })
  ).result;
};

export default saveStrategies;
