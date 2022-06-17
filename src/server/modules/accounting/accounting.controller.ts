import { AccountingService } from './accounting.service';
import { Controller, Get, Query } from '@nestjs/common';
import { accountingDto } from '~shared/commands.dto';

// AccountingController: Controller for the accounting service

@Controller('api/accounting')
export class AccountingController {
  constructor(private accountingService: AccountingService) {}

  @Get()
  async accounting(@Query() args: accountingDto) {
    return this.accountingService.get(args);
  }
}
