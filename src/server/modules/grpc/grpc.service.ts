import { AuthenticatedLnd } from 'lightning';
import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import getPeers from '~server/commands/grpc_utils/get_peers';
import { getSavedNodes } from '~server/lnd';
import { map } from 'async';

type GetPeersArgs = {
  node?: string;
};

@Injectable()
export class GrpcService {
  async getPeers(args: GetPeersArgs): Promise<any> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await getPeers(lnd);
    return { result: result.getLiquidity };
  }

  async getPeersAllNodes(): Promise<any> {
    const nodes = await getSavedNodes({});

    const onlineNodes = nodes.filter.filter(n => !!n.is_online);

    const result = await map(onlineNodes, async (node: { lnd: AuthenticatedLnd; node_name: any }) => {
      const { result } = await getPeers(node.lnd);

      return {
        result: result.getLiquidity,
        node: node.node_name || 'default',
      };
    });
    return { result };
  }
}
