import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { balanceCommand } from '~server/commands';
import { balanceDto } from '~shared/commands.dto';

/** Balance service: Handles the balance command
  {
    lnd: <AuthenticatedLnd>
    [above]: <Number>
    [below]: <Number>
    [is_confirmed]: <Boolean>
    [is_offchain_only]: <Boolean>
    [is_onchain_only]: <Boolean>
  }
  @returns via Promise
  {
    result: <Balance Object>
    error: <Error String>
  }
*/

@Injectable()
export class BalanceService {
  async get(args: balanceDto): Promise<{ result: any; error: string }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result, error } = await balanceCommand(args, lnd);

    return { result, error };
  }
}
