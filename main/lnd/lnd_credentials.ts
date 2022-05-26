import { auto } from 'async';
import getSavedCredentials from './get_saved_credentials';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

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
      // Get the node credentials, if applicable
      getNodeCredentials: [
        async () => {
          return await getSavedCredentials({ node: args.node });
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
