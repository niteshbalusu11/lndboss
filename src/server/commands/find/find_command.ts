import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { findRecord } from 'balanceofsatoshis/lnd';
import { logger } from '~server/utils/global_functions';

/** Get record

  Try to find a record by id

  {
    lnd: <Authenticated LND API Object>
    query: <Query String>
  }

  @returns via Promise
  {
    [chain_transaction]: {
      [chain_fee]: <Paid Transaction Fee Tokens Number>
      [received]: <Received Tokens Number>
      related_channels: [{
        action: <Channel Action String>
        [balance]: <Channel Balance Tokens Number>
        [capacity]: <Channel Capacity Value Number>
        [channel]: <Channel Standard Format Id String>
        [close_tx]: <Channel Closing Transaction Id Hex String>
        [open_tx]: <Channel Opening Transaction id Hex String>
        [timelock]: <Channel Funds Timelocked Until Height Number>
        with: <Channel Peer Public Key Hex String>
      }]
      [sent]: <Sent Tokens Number>
      [sent_to]: [<Sent to Address String>]
      [tx]: <Transaction Id Hex String>
    }
    [channels]: [<Channel Object>]
    [nodes]: [<Node Object>]
    [payment]: <Payment Object>
    [payment_failed]: <Payment Failed Object>
    [payment_pending]: <Payment Pending Bool>
  }
*/

const findCommand = async (args: types.commandFind, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    const result = await findRecord({
      lnd,
      query: args.query,
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default findCommand;
