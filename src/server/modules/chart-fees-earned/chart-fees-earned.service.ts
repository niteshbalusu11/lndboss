import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartFeesEarnedCommand } from '~server/commands';
import { chartFeesEarnedDto } from '~shared/commands.dto';

/** Chart Fees Earned service: Handles the chart fees earned command

  {
    days: <Fees Earned Over Days Count Number>
    is_count: <Return Only Count of Forwards Bool>
    lnds: [<Authenticated LND API Object>]
    [via]: <Via Public Key Hex or Tag Id or Alias String>
  }

  @returns via Promise
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

@Injectable()
export class ChartFeesEarnedService {
  async get(args: chartFeesEarnedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartFeesEarnedCommand(args, lnds);

    return { result };
  }
}
