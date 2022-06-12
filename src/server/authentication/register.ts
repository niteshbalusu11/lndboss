import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const credentials = 'credentials.json';
const home = '.bosgui';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

const register = async ({ accountName, passwordHash }) => {
  const result = await auto({
    validate: [
      ({}, cbk: any) => {
        if (!accountName) {
          return cbk([400, 'ExpectedAccountNameToRegisterUser']);
        }

        if (!passwordHash) {
          return cbk([400, 'ExpectedPasswordHashToRegisterUser']);
        }

        return cbk();
      },
    ],

    // Make sure the node directory is there
    registerDirectory: [
      'validate',
      ({}, cbk: any) => {
        const nodeDirectory = join(...[homedir(), home]);

        return mkdir(nodeDirectory, { recursive: true }, () => {
          // Ignore errors, the directory may already be there
          return cbk();
        });
      },
    ],

    // Write config file
    writeCredentials: [
      'registerDirectory',
      ({}, cbk: any) => {
        // Exit early if not default saved node

        const path = join(...[homedir(), home, credentials]);

        const file = stringify({
          accountName,
          passwordHash,
        });

        return writeFile(path, file, (err: any) => {
          if (!!err) {
            return cbk([503, 'UnexpectedErrorWritingCredentialsFile', { err }]);
          }

          return cbk(null, true);
        });
      },
    ],
  });

  return result.writeCredentials;
};

export default register;
