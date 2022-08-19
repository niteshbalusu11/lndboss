import { AuthenticatedLnd } from 'lightning';
import { httpLogger } from '~server/utils/global_functions';
import { reconnect } from 'balanceofsatoshis/network';

/** Get channel peers that are disconnected and attempt to reconnect

  This method will also disconnect peers that are connected, but have inactive
  channels.

  {
    lnd: <Authenticated LND gRPC API Object>
  }

  @returns via Promise
  {
    offline: [{
      alias: <Node Alias String>
      public_key: <Node Identity Public Key Hex String
    ]}
    reconnected: [{
      alias: <Node Alias String>
      public_key: <Node Identity Public Key Hex String
    }]
  }
*/
type Args = {
  lnd: AuthenticatedLnd;
};

type Result = {
  result: {
    offline: string[];
    reconnected: string[];
  };
};

const reconnectCommand = async ({ lnd }: Args): Promise<{ result: Result }> => {
  try {
    const result = await reconnect({ lnd });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default reconnectCommand;
