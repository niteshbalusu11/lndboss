import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { closedCommand } from '~server/commands';
import { closedDto } from '~shared/commands.dto';

/** Get the last channel close outcomes

  {
    [limit]: <Limit Number>
    lnd: <Authenticated LND API Object>
    request: <Request Function>
  }

  @returns via Promise
  {
    peer_public_key: <Peer Public Key Hex String>
    [peer_alias]: <Peer Alias Strring>
    [is_local_force_close]: <Channel Was Locally Force Closed Bool>
    [is_cooperative_close]: <Channel Was Cooperatively Closed Bool>
    [is_remote_force_close]: <Channel was Remotely Force Closed Bool>
    [peer_closed_channel]: <Peer Closed the Channel Bool>
    blocks_since_close: <Count of Blocks Since Close Number>
    capacity: <Channel Capacity Tokens Number>
    [channel_id]: <Channel Id String>
    channel_open: <Channel Funding Outpoint String>
    channel_close: <Channel Close Transaction Id Hex String>
    [channel_balance_spend]: <Channel Balance Spent In Tx Id Hex String>
    [channel_resolutions]: [{
      type: <Resolution Type String>
      value: <Value Number>
    }]
    [is_breach_close]: <Channel Was Breach Closed Bool>
    [closing_fee_paid]: <Closing Fees Paid Related To Channel Tokens Number>
  }
*/

@Injectable()
export class ClosedService {
  async get(args: closedDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await closedCommand(args, lnd);

    return { result };
  }
}
