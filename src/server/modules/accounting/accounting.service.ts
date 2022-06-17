import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { accountingCommand } from '~server/commands';
import { accountingDto } from '~shared/commands.dto';

@Injectable()
export class AccountingService {
  async get(args: accountingDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await accountingCommand(args, lnd);

    return { result };
  }
}
