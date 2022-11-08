import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { getPendingDto, grpcDto } from '~shared/commands.dto';
import { GrpcService } from './grpc.service';

@Controller()
export class GrpcController {
  constructor(private grpcService: GrpcService) {}

  @Get('api/grpc/get-channel-balance')
  async getChannelBalance(@Query() args: grpcDto) {
    return this.grpcService.getChannelBalance(args);
  }

  @Get('api/grpc/get-peers')
  async getPeers(@Query() args: grpcDto) {
    return this.grpcService.getPeers(args);
  }

  @Get('api/grpc/get-peers-all-nodes')
  async getPeersAllNodes() {
    return this.grpcService.getPeersAllNodes();
  }

  @Post('api/grpc/get-pending')
  async getPending(@Body() args: getPendingDto) {
    return this.grpcService.getPending(args);
  }

  @Get('api/grpc/get-saved-nodes')
  async getSavedNodes() {
    return this.grpcService.getSavedNodes();
  }

  @Get('api/grpc/get-wallet-info')
  async getWalletInfo(@Query() args: grpcDto) {
    return this.grpcService.getWalletInfo(args);
  }
}
