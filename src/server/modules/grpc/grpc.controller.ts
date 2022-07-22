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
}
