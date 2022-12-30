import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { createInvoice } from 'balanceofsatoshis/offchain';
import { interrogate } from 'balanceofsatoshis/commands';

/** Create an invoice for a requested amount
  {
    amount: <Invoice Amount String>
    [description]: <Invoice Description String>
    [expires_in]: <Invoice Expires In Hours Number>
    [is_hinting]: <Include Private Channels Bool>
    [is_selecting_hops]: <Is Selecting Hops Bool>
    [is_virtual]: <Is Using Virtual Channel for Invoice Bool>
    lnd: <Authenticated LND API Object>
    [rate_provider]: <Fiat Rate Provider String>
  }
  @returns via Promise
  {
    [is_settled]: <Invoice Was Paid Bool>
    [request]: <BOLT 11 Payment Request String>
    [tokens]: <Invoice Amount Number>
  }
 */

type Args = {
  args: types.commandInvoice;
  lnd: AuthenticatedLnd;
  logger: Logger;
};
const invoiceCommand = async ({ args, lnd, logger }: Args): Promise<{ result: any }> => {
  const result = await createInvoice({
    lnd,
    logger,
    request,
    amount: args.amount,
    ask: await interrogate({}),
    description: args.description,
    expires_in: args.expires_in,
    is_hinting: args.is_hinting || undefined,
    is_selecting_hops: args.is_selecting_hops || undefined,
    is_virtual: args.is_selecting_hops || undefined,
    rate_provider: args.rate_provider || undefined,
    virtual_fee_rate: args.virtual_fee_rate,
  });

  return { result };
};

export default invoiceCommand;
