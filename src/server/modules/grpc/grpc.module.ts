import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}
