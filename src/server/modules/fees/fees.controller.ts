import { Body, Controller, Post } from '@nestjs/common';
import { feesDto } from '~shared/commands.dto';
import { FeesService } from './fees.service';

// Fees controller: Defines routes for fees command

@Controller()
export class FeesController {
  constructor(private feeService: FeesService) {}

  @Post('api/fees')
  async fees(@Body() args: feesDto) {
    return this.feeService.feesCommand(args);
  }
}
