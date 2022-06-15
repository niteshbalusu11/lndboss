import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chainDepositCommand } from '~server/commands';
import { chainDepositDto } from '~shared/commands.dto';

/** Chain deposit service: Handles the chain deposit command
  {
    [tokens]: <Tokens to Receive Number>
  }

  @returns via Promise
  {
    url: <Deposit Address URL string>
  }
*/

@Injectable()
export class ChainDepositService {
  async get(args: chainDepositDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await chainDepositCommand(args, lnd);

    return { result };
  }
}
