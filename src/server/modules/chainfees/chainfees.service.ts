import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chainfeesCommand } from '~server/commands';
import { chainfeesDto } from '~shared/commands.dto';

/** Get chain fees

  Requires that the lnd is built with walletrpc

  {
    [blocks]: <Block Count Number>
    lnd: <Authenticated LND gRPC API Object>
  }

  @returns via Promise
  {
    current_block_hash: <Chain Tip Best Block Hash Hex String>
    fee_by_block_target: {
      $number: <Kvbyte Fee Rate Number>
    }
  }
*/

@Injectable()
export class ChainfeesService {
  async get(args: chainfeesDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await chainfeesCommand({ args, lnd });

    return { result };
  }
}
