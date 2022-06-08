import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartChainFeesCommand } from '~server/commands';
import { chartChainFeesDto } from '~shared/commands.dto';

@Injectable()
export class ChartChainFeesService {
  async get(args: chartChainFeesDto): Promise<{ result: any; error: string }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { error, result } = await chartChainFeesCommand(args, lnds);

    return { error, result };
  }
}
