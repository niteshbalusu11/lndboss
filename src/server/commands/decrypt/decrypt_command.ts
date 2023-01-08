import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { decryptWithNode } from 'balanceofsatoshis/encryption';

/** Decrypt data from node

  {
    encrypted: <Encrypted Data Hex String>
    lnd: <Authenticated LND gRPC API Object>
  }

  @returns via Promise
  {
    message: <Message Object>
    with_alias: <With Node Public Key Hex String>
    with_public_key: <With Public Key Hex String>
  }
*/

type Args = {
  args: types.commandDecrypt;
  lnd: AuthenticatedLnd;
};
const decryptCommand = async ({ args, lnd }: Args): Promise<{ result: any }> => {
  const result = await decryptWithNode({
    lnd,
    encrypted: args.encrypted,
  });

  return { result };
};

export default decryptCommand;
