import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartFeesPaidCommand } from '~server/commands';
import { chartFeesPaidDto } from '~shared/commands.dto';

@Injectable()
export class ChartFeesPaidService {
  async get(args: chartFeesPaidDto): Promise<{ result: any; error: string }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { error, result } = await chartFeesPaidCommand(args, lnds);

    return { error, result };
  }
}
