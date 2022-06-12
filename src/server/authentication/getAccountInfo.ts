import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const credentials = 'credentials.json';
const home = '.bosgui';

const getAccountInfo = async () => {
  const result = await auto({
    readFile: [
      ({}, cbk: any) => {
        const path = join(...[homedir(), home, credentials]);

        return readFile(path, (err: any, data: any) => {
          if (!!err) {
            return cbk([503, 'UnexpectedErrorReadingCredentialsFile', { err }]);
          }

          return cbk(null, data);
        });
      },
    ],
  });

  return result.readFile;
};

export default getAccountInfo;
