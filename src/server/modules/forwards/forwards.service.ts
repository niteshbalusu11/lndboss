import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { forwardsCommand } from '~server/commands';
import { forwardsDto } from '~shared/commands.dto';

/** Get recent forwarding activity

  {
    [days]: <Days Number>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [is_monochrome]: <Mute Colors Bool>
    [is_table]: <Return Results As Table Bool>
    lnd: <Authenticated LND API Object>
    [sort]: <Sort By Field String>
  }

  @returns via Promise
  {
    peers: [{
      alias: <Peer Alias String>
      earned_inbound_fees: <Earned Inbound Fee Tokens Number>
      earned_outbound_fees: <Earned Outbound Fee Tokens Number>
      last_inbound_at: <Last Inbound Forward At ISO 8601 Date String>
      last_outbound_at: <Last Forward At ISO 8601 Date String>
      liquidity_inbound: <Inbound Liquidity Big Tokens Number>
      outbound_liquidity: <Outbound Liquidity Big Tokens Number>
      public_key: <Public Key String>
    }]
  }
*/

@Injectable()
export class ForwardsService {
  async get(args: forwardsDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await forwardsCommand(args, lnd);

    return { result };
  }
}
