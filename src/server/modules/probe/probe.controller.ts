import { Controller, Get, Query } from '@nestjs/common';
import { probeDto } from '~shared/commands.dto';
import { ProbeService } from './probe.service';

// Probe Controller: Defines routes for probe command

@Controller('api/probe')
export class ProbeController {
  constructor(private probeService: ProbeService) {}

  @Get()
  async probe(@Query() args: probeDto) {
    return this.probeService.probe(args);
  }
}
