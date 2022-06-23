import { auto } from 'async';
import { decryptString } from '~server/utils/global_functions';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const home = '.bosgui';
const credentials = 'credentials.json';
const { isArray } = Array;
const { parse } = JSON;

/** Get saved credentials for node

  {
    node: <Node Name String>
  }

  @returns via Promise
  {
    [credentials]: {
      [cert]: <Base64 or Hex Serialized LND TLS Cert>
      [macaroon]: <Base64 or Hex Serialized Macaroon String>
      socket: <Host:Port Network Address String>
    }
    node: <Node Name String>
  }
*/

type Tasks = {
  validate: () => void;
  decryptMacaroon: {
    macaroon: string;
  };
  getFile: {
    cert_path?: string;
    macaroon_path?: string;
    iv?: string;
    cert: string;
    macaroon: string;
    socket: string;
  };
  getCert: {
    cert_path: string;
    cert: string;
  };
  getMacaroon: string;
  credentials: {
    node: string;
    credentials: {
      cert: string;
      macaroon: string;
      socket: string;
    };
  };
};

const getSavedCredentials = async ({ node }) => {
  const result = await auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!node) {
        return cbk([400, 'ExpectedNodeNameToGetSavedCredentials']);
      }

      if (!!isArray(node)) {
        return cbk([400, 'ExpectedSingleSavedNodeNameToGetCredentialsFor']);
      }

      return cbk();
    },

    // Get the credentials file
    getFile: [
      'validate',
      ({}, cbk: any) => {
        const path = join(...[homedir(), home, node, credentials]);

        return readFile(path, (err, res) => {
          if (!!err || !res) {
            return cbk([404, 'SavedNodeCredentialsFileNotFound', { err }]);
          }

          try {
            parse(res.toString());
          } catch (err) {
            return cbk([400, 'SavedNodeHasInvalidCredentials']);
          }

          const credentials = parse(res.toString());

          return cbk(null, credentials);
        });
      },
    ],

    // Get cert from path if necessary
    getCert: [
      'getFile',
      ({ getFile }, cbk: any) => {
        if (!getFile.cert_path) {
          return cbk(null, getFile.cert);
        }

        return readFile(getFile.cert_path, (err, res) => {
          if (!!err) {
            return cbk([404, 'SavedNodeCertFileNotFound', { err }]);
          }

          return cbk(null, res.toString('base64'));
        });
      },
    ],

    // Get macaroon from path if necessary
    getMacaroon: [
      'getFile',
      ({ getFile }, cbk: any) => {
        if (!getFile.macaroon_path) {
          return cbk(null, getFile.macaroon);
        }

        return readFile(getFile.macaroon_path, (err, res) => {
          if (!!err) {
            return cbk([400, 'SavedNodeMacaroonNotFoundAtPath', { err }]);
          }

          return cbk(null, res.toString('base64'));
        });
      },
    ],

    // Decrypt macaroon if necessary
    decryptMacaroon: [
      'getMacaroon',
      'getFile',
      ({ getMacaroon, getFile }, cbk: any) => {
        // Exit early if there is no macaroon to decrypt, macaroon is a path or base64
        if (!getFile.macaroon || !getFile.iv) {
          return cbk(null, {
            macaroon: getMacaroon,
          });
        }

        // Decrypt macaroon
        const { decryptedData, error } = decryptString({ iv: getFile.iv, encryptedData: getMacaroon });

        if (!!error) {
          return cbk([400, 'SavedNodeMacaroonDecryptionFailed']);
        }

        return cbk(null, {
          macaroon: decryptedData,
        });
      },
    ],

    // Final credentials
    credentials: [
      'decryptMacaroon',
      'getCert',
      'getFile',
      'getMacaroon',
      ({ getCert, getFile, decryptMacaroon }, cbk: any) => {
        if (!getFile.socket) {
          return cbk([400, 'SavedNodeMissingSocket']);
        }

        return cbk(null, {
          node,
          credentials: {
            cert: getCert || undefined,
            macaroon: decryptMacaroon.macaroon,
            socket: getFile.socket,
          },
        });
      },
    ],
  });
  return {
    cert: result.credentials.credentials.cert,
    macaroon: result.credentials.credentials.macaroon,
    socket: result.credentials.credentials.socket,
  };
};

export default getSavedCredentials;
