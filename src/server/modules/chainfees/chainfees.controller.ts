import { Controller, Get, Query } from '@nestjs/common';
import { chainfeesDto } from '~shared/commands.dto';
import { ChainfeesService } from './chainfees.service';

// Chainfees controller: Handles routes to the chainfees service

@Controller('api/chainfees')
export class ChainfeesController {
  constructor(private chainfeesService: ChainfeesService) {}

  @Get()
  async chainfees(@Query() args: chainfeesDto) {
    return this.chainfeesService.get(args);
  }
}
