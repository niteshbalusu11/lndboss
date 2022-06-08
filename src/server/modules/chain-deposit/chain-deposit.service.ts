import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chainDepositCommand } from '~server/commands';
import { chainDepositDto } from '~shared/commands.dto';

@Injectable()
export class ChainDepositService {
  async get(args: chainDepositDto): Promise<{ result: any; error: string }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result, error } = await chainDepositCommand(args, lnd);

    return { result, error };
  }
}
