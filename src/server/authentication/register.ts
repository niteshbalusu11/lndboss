import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const auth = 'auth.json';
const home = '.bosgui';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Register a new user

  {
    username: <Username String>
    password_hash: <Password Hash String>
  }

  @returns via Promise
  {
    result: <Did User Register Bool>
  }
*/

type Args = {
  username: string;
  passwordHash: string;
};

type Tasks = {
  validate: undefined;
  registerDirectory: undefined;
  writeCredentials: boolean;
};

const register = async ({ username, passwordHash }: Args): Promise<boolean> => {
  const result = await auto<Tasks>({
    validate: (cbk: any) => {
      if (!username) {
        return cbk([400, 'ExpectedAccountNameToRegisterUser']);
      }

      if (!passwordHash) {
        return cbk([400, 'ExpectedPasswordHashToRegisterUser']);
      }

      return cbk();
    },

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

        const path = join(...[homedir(), home, auth]);

        const file = stringify({
          username,
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
