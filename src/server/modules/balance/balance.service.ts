import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { balanceCommand } from '~server/commands';
import { balanceDto } from '~shared/commands.dto';

@Injectable()
export class BalanceService {
  async get(args: balanceDto): Promise<{ result: any; error: string }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result, error } = await balanceCommand(args, lnd);

    return { result, error };
  }
}
