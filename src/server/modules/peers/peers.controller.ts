import { Controller, Get, Query } from '@nestjs/common';
import { peersDto } from '~shared/commands.dto';
import { PeersService } from './peers.service';

// Peers Controller: Defines routes for the peers command

@Controller('api/peers')
export class PeersController {
  constructor(private peersService: PeersService) {}

  @Get()
  async getPeers(@Query() args: peersDto) {
    return this.peersService.getPeers(args);
  }
}
