import { existsSync, readFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const home = '.bosgui';
const { parse } = JSON;
const settingsFile = 'settings.json';

/** Write the settings file
  @returns via Promise
  data: <Settings JSON String Object>
*/
type Tasks = {
  checkFile: boolean;
  readFile: string;
};
const getSettingsFile = async () => {
  return (
    await auto<Tasks>({
      // Check if the settings file exists
      checkFile: [
        (cbk: any) => {
          const filePath = join(...[homedir(), home, settingsFile]);

          return cbk(null, existsSync(filePath));
        },
      ],

      // Read the settings file
      readFile: [
        'checkFile',
        ({ checkFile }, cbk: any) => {
          // Exit early if the settings file doesn't exist
          if (!checkFile) {
            return cbk();
          }

          const filePath = join(...[homedir(), home, settingsFile]);

          readFile(filePath, (err, data) => {
            if (!!err) {
              return cbk([500, 'UnexpectedErrorReadingSettingsFile', err]);
            }

            try {
              parse(data.toString());
            } catch (err) {
              return cbk([400, 'ExpectedValidJsonSettingsFile', { err }]);
            }

            return cbk(null, data.toString());
          });
        },
      ],
    })
  ).readFile;
};

export default getSettingsFile;
