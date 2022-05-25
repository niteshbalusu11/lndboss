import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';
import getSavedCredentials from './get_saved_credentials';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

const config = 'config.json';
const fs = { getFile: readFile };
const home = '.bosgui';
const { parse } = JSON;

/** LND credentials

  {
    [node]: <Node Name String>
  }

  @returns via cbk or Promise
  {
    cert: <Cert String>
    macaroon: <Macaroon String>
    socket: <Socket String>
    error: <Error String>
  }
*/
type Tasks = {
  forNode: any;
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

const lndCredentials = async (args: Args) => {
  try {
    const result = await auto<Tasks>({
      // Figure out which node the credentials are for
      forNode: (cbk: any) => {
        if (!!args.node) {
          return cbk(null, args.node);
        }

        const path = join(...[homedir(), home, config]);

        return fs.getFile(path, (err, res) => {
          // Exit early on errors, there is no config found
          if (!!err || !res) {
            return cbk();
          }

          try {
            parse(res.toString());
          } catch (err) {
            return cbk([400, 'ConfigurationFileIsInvalidFormat', { err }]);
          }

          const config = parse(res.toString());

          if (!!config.default_saved_node) {
            return cbk(null, config.default_saved_node);
          }

          return cbk();
        });
      },

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
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default lndCredentials;
