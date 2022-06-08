import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';

const credentials = 'credentials.json';
const home = '.bosgui';
const config = 'config.json';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Write saved credentials for node

  {
    [cert]: <Base64 Encoded Node TLS Certificate String>
    macaroon: <Base64 Encoded Macaroon String>
    node: <Node Name String>
    socket: <Node Socket String>
  }

  @returns via cbk or Promise
  {
    result: <Did Write Credentials Bool>
    [error]: <Error String>
  }
*/

type Tasks = {
  validate: null;
  registerDirectory: null;
  writeCredentials: boolean;
  writeConfig: null;
};

type Args = {
  cert: string;
  macaroon: string;
  node: string;
  socket: string;
  is_default: boolean;
};

const putSavedCredentials = async (args: Args) => {
  try {
    const result = await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!args.macaroon) {
          return cbk([400, 'ExpectedMacaroonForSavedCredentials']);
        }

        if (!args.node) {
          return cbk([400, 'ExpectedNodeNameToPutSavedCredentials']);
        }

        if (!args.socket) {
          return cbk([400, 'ExpectedSocketForNodeToPutSavedCredentials']);
        }

        return cbk();
      },

      // Make sure the node directory is there
      registerDirectory: [
        'validate',
        ({}, cbk: any) => {
          const nodeDirectory = join(...[homedir(), home, args.node]);

          return mkdir(nodeDirectory, { recursive: true }, () => {
            // Ignore errors, the directory may already be there
            return cbk();
          });
        },
      ],

      // Write config file
      writeConfig: [
        'registerDirectory',
        ({}, cbk: any) => {
          // Exit early if not default saved node
          if (!args.is_default) {
            return cbk();
          }

          const path = join(...[homedir(), home, config]);

          const file = stringify({
            default_saved_node: args.node,
          });

          return writeFile(path, file, (err: any) => {
            if (!!err) {
              return cbk([503, 'UnexpectedErrorWritingConfigFile', { err }]);
            }

            return cbk();
          });
        },
      ],

      // Write credentials
      writeCredentials: [
        'registerDirectory',
        ({}, cbk: any) => {
          const file = stringify({
            cert: args.cert || undefined,
            macaroon: args.macaroon || undefined,
            socket: args.socket,
          });

          const path = join(...[homedir(), home, args.node, credentials]);

          return writeFile(path, file, (err: any) => {
            if (!!err) {
              return cbk([503, 'UnexpectedErrorWritingSavedCredentials', { err }]);
            }

            return cbk(null, true);
          });
        },
      ],
    });
    return { result: result.writeCredentials };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default putSavedCredentials;
