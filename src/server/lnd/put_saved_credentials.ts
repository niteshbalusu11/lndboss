import { encryptString, httpLogger } from '~server/utils/global_functions';
import { existsSync, mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { encryptionKey } from '~server/utils/constants';
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

  @returns via Promise
  {
    result: <Did Write Credentials Bool>
    [error]: <Error String>
  }
*/

type Tasks = {
  validate: null;
  isValidPath: boolean;
  registerDirectory: null;
  writeCredentials: boolean;
  writePathToCredentials: boolean;
  encryptMacaroon: {
    encryptedMacaroon: string;
    iv: string;
  };
  finalCredentials: {
    cert: string;
    macaroon: string;
    socket: string;
  };
  writeConfig: null;
};

type Args = {
  auth_type: string;
  cert?: string;
  lnd_directory?: string;
  macaroon?: string;
  network_type?: string;
  node: string;
  socket: string;
  is_default: boolean;
};

const putSavedCredentials = async (args: Args): Promise<{ result: boolean }> => {
  const result = await auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!args.auth_type) {
        return cbk(httpLogger({ error: [400, 'ExpectedAuthTypeToPutSavedCredentials'] }));
      }

      if (args.auth_type === 'credentials' && !args.macaroon) {
        return cbk(httpLogger({ error: [400, 'ExpectedMacaroonToPutSavedCredentials'] }));
      }

      if (!args.node) {
        return cbk(httpLogger({ error: [400, 'ExpectedSavedNodeNameToPutSavedCredentials'] }));
      }

      if (!args.socket) {
        return cbk(httpLogger({ error: [400, 'ExpectedSocketForNodeToPutSavedCredentials'] }));
      }

      return cbk();
    },

    // Check if paths are valid
    isValidPath: [
      'validate',
      ({}, cbk: any) => {
        if (args.auth_type !== 'path') {
          return cbk();
        }

        if (!existsSync(args.lnd_directory)) {
          return cbk(httpLogger({ error: [400, 'ExpectedValidLndDirectoryToPutSavedCredentials'] }));
        }

        const certPath = join(args.lnd_directory, 'tls.cert');
        if (!existsSync(certPath)) {
          return cbk(httpLogger({ error: [400, 'ExpectedLndCertificateAtPathToPutSavedCredentials'] }));
        }

        const macPath = join(args.lnd_directory, 'data', 'chain', 'bitcoin', args.network_type, 'admin.macaroon');
        if (!existsSync(macPath)) {
          return cbk(httpLogger({ error: [400, 'ExpectedLndMacaroonAtPathToPutSavedCredentials'] }));
        }

        return cbk();
      },
    ],

    // Make sure the node directory is there
    registerDirectory: [
      'isValidPath',
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
      'isValidPath',
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
            return cbk(httpLogger({ error: [503, 'UnexpectedErrorWritingConfigFile', { err }] }));
          }

          return cbk();
        });
      },
    ],

    // Write path to credentials file
    writePathToCredentials: [
      'isValidPath',
      'registerDirectory',
      ({}, cbk: any) => {
        // Exit early if cert and macaroon are not paths
        if (args.auth_type !== 'path') {
          return cbk();
        }

        const certPath = join(args.lnd_directory, 'tls.cert');

        const macPath = join(args.lnd_directory, 'data', 'chain', 'bitcoin', args.network_type, 'admin.macaroon');

        const file = stringify({
          cert_path: certPath,
          macaroon_path: macPath,
          socket: args.socket,
        });

        const path = join(...[homedir(), home, args.node, credentials]);

        return writeFile(path, file, (err: any) => {
          if (!!err) {
            return cbk(httpLogger({ error: [503, 'UnexpectedErrorWritingSavedCredentials', { err }] }));
          }

          return cbk(null, true);
        });
      },
    ],

    // Encrypt macaroon
    encryptMacaroon: [
      'isValidPath',
      'registerDirectory',
      ({}, cbk: any) => {
        // Exit early if there is no encryption key
        if (args.auth_type !== 'credentials' || !encryptionKey || encryptionKey === '') {
          return cbk();
        }

        const macaroon = args.macaroon;

        const { iv, encryptedData, error } = encryptString({ text: macaroon });

        if (!!error) {
          return cbk(httpLogger({ error: [503, 'UnexpectedErrorEncryptingMacaroon', { error }] }));
        }

        return cbk(null, {
          encryptedMacaroon: encryptedData,
          iv,
        });
      },
    ],

    finalCredentials: [
      'encryptMacaroon',
      'isValidPath',
      'registerDirectory',
      ({ encryptMacaroon }, cbk: any) => {
        // Exit early if macaroon is not encrypted
        if (!encryptMacaroon || !encryptMacaroon.encryptedMacaroon || !encryptMacaroon.iv) {
          return cbk(null, {
            cert: args.cert,
            macaroon: args.macaroon,
            socket: args.socket,
          });
        }

        return cbk(null, {
          cert: args.cert,
          macaroon: encryptMacaroon.encryptedMacaroon,
          iv: encryptMacaroon.iv,
          socket: args.socket,
        });
      },
    ],

    // Write credentials
    writeCredentials: [
      'encryptMacaroon',
      'finalCredentials',
      'isValidPath',
      'registerDirectory',
      ({ finalCredentials }, cbk: any) => {
        // Exit early if cert and macaroon are paths
        if (args.auth_type !== 'credentials') {
          return cbk();
        }

        const file = stringify(finalCredentials);

        const path = join(...[homedir(), home, args.node, credentials]);

        return writeFile(path, file, (err: any) => {
          if (!!err) {
            return cbk(httpLogger({ error: [503, 'UnexpectedErrorWritingSavedCredentials', { err }] }));
          }

          return cbk(null, true);
        });
      },
    ],
  });
  return { result: result.writePathToCredentials || result.writeCredentials };
};

export default putSavedCredentials;
