import { auto } from 'async';
import { AuthenticatedLnd, authenticatedLndGrpc } from 'lightning';
import lndCredentials from './lnd_credentials';

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Authenticated LND

  {
    [node]: <Node Name String>
  }

  @returns via cbk or Promise
  {
    lnd: <Authenticated LND gRPC API Object>
    error: <Error String>
  }
*/

type Tasks = {
  credentials: {
    cert: string;
    macaroon: string;
    socket: string;
  };
  lnd: {
    lnd: AuthenticatedLnd;
  };
};

const authenticatedLnd = async ({ node }: { node: string }) => {
  try {
    const result = await auto<Tasks>({
      // Credentials
      credentials: async () => {
        return await lndCredentials({ node });
      },

      // Lnd
      lnd: [
        'credentials',
        ({ credentials }, cbk) => {
          const { lnd } = authenticatedLndGrpc({
            cert: credentials.cert,
            macaroon: credentials.macaroon,
            socket: credentials.socket,
          });
          return cbk(null, { lnd: lnd });
        },
      ],
    });
    const { lnd } = result.lnd;
    return { lnd };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default authenticatedLnd;
