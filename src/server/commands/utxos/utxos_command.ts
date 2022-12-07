import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getUtxos } from 'balanceofsatoshis/chain';

/** Get UTXOs

  {
    [count_below]: <Return Only Count, And Below Number>
    [is_count]: <Return Only Count Bool>
    [is_confirmed]: <Return Only Confirmed Utxos Bool>
    lnd: <Authenticated gRPC LND API Object>
    [min_tokens]: <Return Utxos of Value Above Tokens Size Number>
  }

  // Non-count response
  @returns via Promise
  {
    utxos: [{
      address: <Chain Address String>
      amount: <Coins Amount String>
      [confirmations]: <Confirmation Count Number>
      outpoint: <Coin Outpoint String>
      [is_unconfirmed]: <UTXO is Confirmed Bool>
      [locked]: <UTXO Lock Id Hex String>
      [lock_expires_at]: <UTXO Lock Expiration ISO 8601 Date String>
      [related_description]: <Transaction Description String>
      [related_channels]: [<Related Channel Description String>]
    }]
  }

  // Count response
  @returns via Promise
  <Count Number>
*/
type Args = {
  args: types.commandUtxos;
  lnd: AuthenticatedLnd;
};
const utxosCommand = async ({ args, lnd }: Args) => {
  const result = await getUtxos({
    lnd,
    count_below: args.count_below,
    is_confirmed: args.is_confirmed,
    is_count: args.is_count,
    min_tokens: args.min_tokens,
  });

  return { result };
};

export default utxosCommand;
