import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { encryptToNode } from 'balanceofsatoshis/encryption';

/** Encrypt data to a node

  {
    lnd: <Authenticated LND gRPC API Object>
    message: <Message to Encrypt String>
    [to]: <Encrypt to Public Key Hex String>
  }

  @returns via Promise
  {
    encrypted: <Encrypted Data String>
    to: <Encrypted To Node Hex String>
  }
*/
type Args = {
  args: types.commandEncrypt;
  lnd: AuthenticatedLnd;
};

const encryptCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  const result = await encryptToNode({
    lnd,
    message: args.message,
    to: args.to,
  });

  return { result };
};

export default encryptCommand;
