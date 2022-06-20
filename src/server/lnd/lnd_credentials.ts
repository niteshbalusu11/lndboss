import { auto } from 'async';
import getSavedCredentials from './get_saved_credentials';
import { homedir } from 'os';
import { join } from 'path';
import { logger } from '~server/utils/global_functions';
import { readFile } from 'fs';

const config = 'config.json';
const home = '.bosgui';
const { parse } = JSON;

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

        const path = join(...[homedir(), home, config]);

        return readFile(path, (err, res) => {
          // Exit early on errors, there is no config found
          if (!!err || !res) {
            return cbk();
          }

          try {
            parse(res.toString());
          } catch (err) {
            return cbk(logger({ error: [400, 'ExpectedValidConfigFileToGetCredentials', { err }] }));
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

    // Get the node credentials, if applicable
    getNodeCredentials: [
      'forNode',
      async ({ forNode }) => {
        return await getSavedCredentials({ node: forNode });
      },
    ],

    credentials: [
      'getNodeCredentials',
      ({ getNodeCredentials }, cbk) => {
        // Exit early with the default credentials when no node is specified
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
