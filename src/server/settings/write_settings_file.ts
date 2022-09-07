import * as defaultSettings from './settings.json';

import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const home = '.bosgui';
const settingsFile = 'settings.json';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Write the settings file
  {
    settings: <Settings Object>
  }

  @returns via Promise
*/
const writeSettingsFile = async ({ settings }) => {
  return (
    await auto({
      // Check arguments
      validate: (cbk: any) => {
        if (!settings) {
          return cbk([400, 'ExpectedSettingsObjectToWriteSettingsFile']);
        }

        if (!!settings) {
          if (typeof settings !== 'object') {
            return cbk([400, 'ExpectedValidSettingsObjectToWriteSettingsFile']);
          }
        }

        return cbk();
      },

      // Make sure the node directory is there
      registerDirectory: [
        'validate',
        ({}, cbk: any) => {
          const homeDirPath = join(...[homedir(), home]);

          return mkdir(homeDirPath, () => {
            // Ignore errors, the directory may already be there
            return cbk();
          });
        },
      ],

      // write the settings file
      writeFile: [
        'registerDirectory',
        ({}, cbk: any) => {
          const filePath = join(...[homedir(), home, settingsFile]);

          const data = settings || defaultSettings;

          writeFile(filePath, stringify(data), err => {
            if (!!err) {
              return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
            }

            return cbk();
          });
        },
      ],
    })
  ).writeFile;
};

export default writeSettingsFile;
