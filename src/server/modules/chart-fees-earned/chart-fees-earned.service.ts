import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartFeesEarnedCommand } from '~server/commands';
import { chartFeesEarnedDto } from '~shared/commands.dto';

@Injectable()
export class ChartFeesEarnedService {
  async get(args: chartFeesEarnedDto): Promise<{ result: any; error: string }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { error, result } = await chartFeesEarnedCommand(args, lnds);

    return { error, result };
  }
}
