import { AuthenticatedLnd, authenticatedLndGrpc, getWalletInfo } from 'lightning';
import { auto, filter, map } from 'async';
import { lstat, mkdir, readFile, readdir, rmdir, unlink, writeFile } from 'fs';

import authenticatedLnd from './authenticated_lnd';
import { getNetwork } from 'ln-sync';
import getSavedCredentials from './get_saved_credentials';
import { homedir } from 'os';
import { join } from 'path';

const home = '.bosgui';

const fs = {
  writeFile,
  getDirectoryFiles: readdir,
  getFile: readFile,
  getFileStatus: lstat,
  makeDirectory: mkdir,
  removeDirectory: rmdir,
  removeFile: unlink,
};

/** Get a list of saved nodes

  {
    fs: {
      getDirectoryFiles: <Read Directory Contents Function> (path, cbk) => {}
      getFile: <Read File Contents Function> (path, cbk) => {}
      getFileStatus: <File Status Function> (path, cbk) => {}
    }
    [network]: <Required Network Name String>
  }

  @returns via cbk or Promise
  {
    nodes: [{
      [is_online]: <Node is Online Bool>
      lnd: <Authenticated LND API Object>
      node_name: <Node Name String>
      public_key: <Node Identity Public Key Hex String>
    }]
  }
*/

type Tasks = {
  validate: undefined;
  dataDir: string;
  checkDataDir: null;
  getDirs: string[];
  getNodeCredentials: {
    node: string;
    credentials: {
      cert: string;
      macaroon: string;
      socket: string;
    };
  }[];
  getNodes: {
    lnd: AuthenticatedLnd;
    is_online: boolean;
    node_name: string;
    public_key: string;
  }[];
  filter: {
    lnd: AuthenticatedLnd;
    is_online: boolean;
    node_name: string;
    public_key: string;
  }[];
  nodes: {
    nodes: {
      lnd: AuthenticatedLnd;
      is_online: boolean;
      node_name: string;
      public_key: string;
    }[];
  };
  removeDuplicates: {
    lnd: AuthenticatedLnd;
    is_online: boolean;
    node_name: string;
    public_key: string;
  }[];
};

type Args = {
  network?: string;
};

const getSavedNodes = async ({ network }: Args) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!fs) {
        return cbk([400, 'ExpectedFileSystemMethods']);
      }

      if (!fs.getDirectoryFiles) {
        return cbk([400, 'ExpectedGetDirectoryFilesMethod']);
      }

      if (!fs.getFile) {
        return cbk([400, 'ExpectedReadFileFunction']);
      }

      if (!fs.getFileStatus) {
        return cbk([400, 'ExpectedReadFileStatusFunction']);
      }

      return cbk();
    },

    // Data directory
    dataDir: [
      'validate',
      ({}, cbk) => {
        return cbk(null, join(...[homedir(), home]));
      },
    ],

    // Check that the data directory exists
    checkDataDir: [
      'dataDir',
      ({ dataDir }, cbk: any) => {
        return fs.getFileStatus(dataDir, (err, res) => {
          if (!!err) {
            // Ignore errors, directory may not exist
          }

          if (!!res && !res.isDirectory()) {
            return cbk([400, 'FailedToFindHomeDataDirectory']);
          }

          return cbk();
        });
      },
    ],

    // Get the sub directories in the data directory
    getDirs: [
      'checkDataDir',
      'dataDir',
      ({ dataDir }, cbk: any) => {
        return fs.getDirectoryFiles(dataDir, (_err, files) => {
          return filter(
            files,
            (file, cbk: any) => {
              const path = join(...[homedir(), home, file]);

              return fs.getFileStatus(path, (err, res) => {
                if (!!err) {
                  return cbk([503, 'UnexpectedErrCheckingForNodeDir', { err }]);
                }

                return cbk(null, res.isDirectory());
              });
            },
            cbk
          );
        });
      },
    ],

    // Get node credentials
    getNodeCredentials: [
      'getDirs',
      async ({ getDirs }) => {
        return map(getDirs, async (dir: string) => {
          const credentials = await getSavedCredentials({ node: dir });

          return {
            node: dir,
            credentials,
          };
        });
      },
    ],

    // Get node info
    getNodes: [
      'getNodeCredentials',
      ({ getNodeCredentials }, cbk: any) => {
        return map(
          getNodeCredentials,
          ({ credentials, node }, cbk: any) => {
            if (!credentials) {
              return cbk([400, 'InvalidCredentialsForNode', { node }]);
            }

            const { lnd } = authenticatedLndGrpc(credentials);

            return getWalletInfo({ lnd }, (err, res) => {
              if (!!err) {
                return cbk(null, { node_name: node });
              }

              return cbk(null, {
                lnd,
                is_online: res.is_synced_to_chain,
                node_name: node,
                public_key: res.public_key,
              });
            });
          },
          cbk
        );
      },
    ],

    // Get default node and adjust filter (from path or default directories)
    removeDuplicates: [
      'getNodes',
      async ({ getNodes }) => {
        try {
          const { lnd } = await authenticatedLnd({});
          const publicKey = (await getWalletInfo({ lnd })).public_key;
          const node = getNodes.find(n => n.public_key === publicKey);

          if (!node) {
            getNodes.push({ lnd, is_online: true, node_name: '', public_key: publicKey });

            return getNodes;
          }
          return getNodes;
        } catch (err) {
          return getNodes;
        }
      },
    ],

    // Filter out nodes not on the specified network
    filter: [
      'removeDuplicates',
      ({ removeDuplicates }, cbk) => {
        // Exit early when no network is specified
        if (!network) {
          return cbk(null, removeDuplicates);
        }

        return filter(
          removeDuplicates,
          ({ lnd }, cbk) => {
            return getNetwork({ lnd }, (err, res) => {
              // Ignore errors, node may not be connected
              if (!!err) {
                return cbk();
              }

              return cbk(null, res.network === network);
            });
          },
          cbk
        );
      },
    ],

    // Final list of nodes
    nodes: ['filter', ({ filter }, cbk) => cbk(null, { nodes: filter })],
  });
};

export default getSavedNodes;
