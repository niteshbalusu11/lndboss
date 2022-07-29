import * as getCert from 'balanceofsatoshis/lnd/get_cert';
import * as getMacaroon from 'balanceofsatoshis/lnd/get_macaroon';
import * as getPath from 'balanceofsatoshis/lnd/get_path';
import * as getSocket from 'balanceofsatoshis/lnd/get_socket';

import { homedir, platform, userInfo } from 'os';

import { auto } from 'async';
import getSavedCredentials from './get_saved_credentials';
import { httpLogger } from '~server/utils/global_functions';
import { join } from 'path';
import { readFile } from 'fs';

const config = 'config.json';
const defaultLndDirPath = process.env.BOS_DEFAULT_LND_PATH;
const defaultNodeName = process.env.BOS_DEFAULT_SAVED_NODE;
const defaultSocket = process.env.BOS_DEFAULT_LND_SOCKET;
const fs = { getFile: readFile };
const home = '.bosgui';
const os = { homedir, platform, userInfo };
const { parse } = JSON;
const socket = 'localhost:10009';

/** LND credentials

  {
    [node]: <Node Name String>
  }

  @returns via Promise
  {
    cert: <Cert String>
    macaroon: <Macaroon String>
    socket: <Socket String>
    [error]: <Error String>
  }
*/

type Tasks = {
  forNode: {
    node: string | null;
  };
  getNodeCredentials: {
    cert: string;
    macaroon: string;
    socket: string;
  };
  credentials: {
    cert: string;
    macaroon: string;
    socket: string;
  };
  getPath: {
    path: string;
  };
  getCert: {
    cert: string | undefined;
  };
  getMacaroon: {
    macaroon: string;
  };
  getSocket: {
    socket: string;
  };
};

type Args = {
  node: string;
};

type Return = {
  cert: string;
  macaroon: string;
  socket: string;
};

const lndCredentials = async (args: Args): Promise<Return> => {
  const result = await auto<Tasks>({
    // Figure out which node the credentials are for
    forNode: (cbk: any) => {
      try {
        if (!!args.node) {
          return cbk(null, args.node);
        }

        if (!!defaultNodeName) {
          return cbk(null, defaultNodeName);
        }

        const path = join(...[homedir(), home, config]);

        return readFile(path, (err, res) => {
          // Exit early on errors, there is no config found
          if (!!err || !res) {
            return cbk();
          }

          try {
            parse(res.toString());
          } catch (err) {
            return cbk(httpLogger({ error: [400, 'ExpectedValidConfigFileToGetCredentials', { err }] }));
          }

          const config = parse(res.toString());

          if (!!config.default_saved_node) {
            return cbk(null, config.default_saved_node);
          }

          return cbk();
        });
      } catch (err) {
        return cbk(err);
      }
    },

    // Look for a special path
    getPath: [
      'forNode',
      async ({ forNode }) => {
        // Exit early when a specific node is used
        if (!!forNode) {
          return {};
        }

        // Exit early when there is a default LND path
        if (!!defaultLndDirPath) {
          return { path: defaultLndDirPath };
        }

        return await getPath({ fs, os });
      },
    ],

    // Get the default cert
    getCert: [
      'forNode',
      'getPath',
      async ({ forNode, getPath }) => {
        // Exit early when a specific node is used
        if (!!forNode) {
          return { cert: '' };
        }

        return await getCert({ fs, os, node: forNode, path: getPath.path });
      },
    ],

    // Get the default macaroon
    getMacaroon: [
      'forNode',
      'getPath',
      async ({ forNode, getPath }) => {
        // Exit early when a specific node is used

        if (!!forNode) {
          return { macaroon: '' };
        }

        return await getMacaroon({ fs, os, node: forNode, path: getPath.path });
      },
    ],

    // Get the socket out of the ini file
    getSocket: [
      'forNode',
      'getPath',
      async ({ forNode, getPath }) => {
        // Exit early when a socket is specified in env variable
        if (!!defaultSocket) {
          return { socket: defaultSocket };
        }
        // Exit early when a specific node is used
        if (!!forNode) {
          return { socket: '' };
        }

        return await getSocket({ fs, os, node: forNode, path: getPath.path });
      },
    ],

    // Get the node credentials, if applicable
    getNodeCredentials: [
      'forNode',
      async ({ forNode }) => {
        if (!forNode) {
          return;
        }
        return await getSavedCredentials({ node: forNode });
      },
    ],

    credentials: [
      'getNodeCredentials',
      'getCert',
      'getMacaroon',
      'getPath',
      'getSocket',
      ({ forNode, getNodeCredentials, getCert, getMacaroon, getSocket }, cbk) => {
        // Exit early with the default credentials when no node is specified
        if (!forNode) {
          return cbk(null, {
            cert: getCert.cert,
            macaroon: getMacaroon.macaroon,
            socket: getSocket.socket || socket,
          });
        }

        return cbk(null, {
          cert: getNodeCredentials.cert,
          macaroon: getNodeCredentials.macaroon,
          socket: getNodeCredentials.socket,
        });
      },
    ],
  });
  return { cert: result.credentials.cert, macaroon: result.credentials.macaroon, socket: result.credentials.socket };
};

export default lndCredentials;
