import { Controller, Get, Query } from '@nestjs/common';
import { findDto } from '~shared/commands.dto';
import { FindService } from './find.service';

// Find Controller: Defines routes for find command

@Controller('api/find')
export class FindController {
  constructor(private findService: FindService) {}

  @Get()
  async find(@Query() args: findDto) {
    return this.findService.get(args);
  }
}
