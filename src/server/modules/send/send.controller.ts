import { Controller, Get, Query } from '@nestjs/common';
import { sendDto } from '~shared/commands.dto';
import { SendService } from './send.service';

// Send Controller: Defines routes for the send command

@Controller('api/send')
export class SendController {
  constructor(private sendService: SendService) {}

  @Get()
  async rebalance(@Query() args: sendDto) {
    return this.sendService.send(args);
  }
}
