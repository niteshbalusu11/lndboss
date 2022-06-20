import { AuthenticatedLnd, authenticatedLndGrpc } from 'lightning';

import { auto } from 'async';
import lndCredentials from './lnd_credentials';

/** Authenticated LND

  {
    [node]: <Node Name String>
  }

  @returns via Promise
  {
    lnd: <Authenticated LND gRPC API Object>
    [error]: <Error String>
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

const authenticatedLnd = async ({ node }: { node?: string }) => {
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
        return cbk(null, { lnd });
      },
    ],
  });
  const { lnd } = result.lnd;
  return { lnd };
};

export default authenticatedLnd;
