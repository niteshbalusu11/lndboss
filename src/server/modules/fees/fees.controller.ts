import { Body, Controller, Post } from '@nestjs/common';
import { feesDto, feesStrategiesDto } from '~shared/commands.dto';
import { FeesService } from './fees.service';

// Fees controller: Defines routes for fees command

@Controller()
export class FeesController {
  constructor(private feeService: FeesService) {}

  @Post('api/fees')
  async fees(@Body() args: feesDto) {
    return this.feeService.feesCommand(args);
  }

  @Post('api/fees/save-strategies')
  async save(@Body() args: feesStrategiesDto) {
    return this.feeService.save(args);
  }

  @Post('api/fees/getfile')
  async getFile() {
    return this.feeService.readFeesFile();
  }
}
