import { Controller, Get, Query } from '@nestjs/common';
import { balanceDto } from '~shared/commands.dto';

import { BalanceService } from './balance.service';

// Balance Controller: Defines routes for balance command

@Controller('api/balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  async balance(@Query() args: balanceDto) {
    return this.balanceService.get(args);
  }
}
