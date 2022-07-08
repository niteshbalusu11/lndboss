import { Controller, Get, Query } from '@nestjs/common';
import { forwardsDto } from '~shared/commands.dto';
import { ForwardsService } from './forwards.service';

// Forwards Controller: Defines routes for the forwards command

@Controller('api/forwards')
export class ForwardsController {
  constructor(private forwardsService: ForwardsService) {}

  @Get()
  async forwards(@Query() args: forwardsDto) {
    return this.forwardsService.get(args);
  }
}
