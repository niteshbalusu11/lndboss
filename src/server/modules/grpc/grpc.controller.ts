import { Controller, Get, Query } from '@nestjs/common';
import { grpcDto } from '~shared/commands.dto';
import { GrpcService } from './grpc.service';

@Controller()
export class GrpcController {
  constructor(private grpcService: GrpcService) {}

  @Get('api/grpc/get-peers')
  async getPeers(@Query() args: grpcDto) {
    return this.grpcService.getPeers(args);
  }

  @Get('api/grpc/get-peers-all-nodes')
  async getPeersAllNodes() {
    return this.grpcService.getPeersAllNodes();
  }

  @Get('api/grpc/get-wallet-info')
  async getWalletInfo(@Query() args: grpcDto) {
    return this.grpcService.getWalletInfo(args);
  }

  @Get('api/grpc/get-channel-balance')
  async getChannelBalance(@Query() args: grpcDto) {
    return this.grpcService.getChannelBalance(args);
  }

  @Get('api/grpc/get-saved-nodes')
  async getSavedNodes() {
    return this.grpcService.getSavedNodes();
  }
}
