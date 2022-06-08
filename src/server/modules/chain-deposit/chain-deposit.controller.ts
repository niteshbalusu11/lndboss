import { Controller, Get, Query } from '@nestjs/common';
import { chainDepositDto } from '~shared/commands.dto';

import { ChainDepositService } from './chain-deposit.service';

@Controller('api/chain-deposit')
export class ChainDepositController {
  constructor(private chainDepositService: ChainDepositService) {}

  @Get()
  async chainDeposit(@Query() args: chainDepositDto) {
    return this.chainDepositService.get(args);
  }
}
