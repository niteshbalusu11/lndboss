import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { peersCommand } from '~server/commands';
import { peersDto } from '~shared/commands.dto';

/** Get channel-connected peers

  {
    [earnings_days]: <Routing Fee Earnings Days Number>
    [filters]: [<Formula Expression String>]
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [idle_days]: <Not Active For Days Number>
    [is_active]: <Active Channels Only Bool>
    [is_offline]: <Offline Channels Only Bool>
    [is_private]: <Private Channels Only Bool>
    [is_public]: <Public Channels Only Bool>
    [is_table]: <Peers As Table Bool>
    lnd: <Authenticated LND gRPC API Object>
    omit: [<Omit Peer With Public Key Hex String>]
    [sort_by]: <Sort Results By Attribute String>
    [tags]: [<Tag Identifier String>]
  }

  @returns via Promise
  {
    peers: [{
      alias: <Node Alias String>
      [fee_earnings]: <Fees Earned Via Peer Tokens Number>
      first_connected: <Oldest Channel With Peer String>
      [last_activity]: <Last Activity String>
      inbound_fee_rate: <Inbound Fee Rate String>
      inbound_liquidity: <Inbound Liquidity Amount Number>
      outbound_liquidity: <Outbound Liquidity Amount Number>
      public_key: <Public Key Hex String>
    }]
  }
*/

type Result = {
  peers: {
    alias: string;
    fee_earnings?: number;
    first_connected: string;
    last_activity?: string;
    inbound_fee_rate: string;
    inbound_liquidity: number;
    outbound_liquidity: number;
    public_key: string;
  };
  rows?: any[];
};
@Injectable()
export class PeersService {
  async getPeers(args: peersDto): Promise<{ result: Result }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await peersCommand({ args, lnd });

    return { result };
  }
}
