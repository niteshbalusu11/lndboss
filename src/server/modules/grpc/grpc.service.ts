import { AuthenticatedLnd, GetChannelBalanceResult, GetWalletInfoResult } from 'lightning';
import { channelBalance, walletInfo } from '~server/commands/grpc_utils/grpc_utils';
import { getPendingDto, grpcDto } from '~shared/commands.dto';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import getPeers from '~server/commands/grpc_utils/get_peers';
import { getPending } from '~server/commands/grpc_utils';
import { getSavedNodes } from '~server/lnd';
import { map } from 'async';

type GetPeersArgs = {
  node?: string;
};

@Injectable()
export class GrpcService {
  async getChannelBalance(args: grpcDto): Promise<{ result: GetChannelBalanceResult }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await channelBalance({ lnd });
    return { result };
  }

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

  async getPending(args: getPendingDto): Promise<any> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await getPending({ lnd });

    return result;
  }

  async getSavedNodes(): Promise<{ result: any }> {
    const nodes = await getSavedNodes({});
    return { result: nodes.nodes };
  }

  async getWalletInfo(args: grpcDto): Promise<{ result: GetWalletInfoResult }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await walletInfo({ lnd });
    return { result };
  }
}
