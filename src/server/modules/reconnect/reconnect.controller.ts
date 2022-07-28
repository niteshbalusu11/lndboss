import { Controller, Get, Query } from '@nestjs/common';
import { reconnectDto } from '~shared/commands.dto';
import { ReconnectService } from './reconnect.service';

@Controller('api/reconnect')
export class ReconnectController {
  constructor(private readonly reconnectService: ReconnectService) {}

  @Get()
  async reconnect(@Query() args: reconnectDto): Promise<{ result: any }> {
    return this.reconnectService.reconnect(args);
  }
}
