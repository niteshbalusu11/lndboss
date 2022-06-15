import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartFeesPaidCommand } from '~server/commands';
import { chartFeesPaidDto } from '~shared/commands.dto';

/** Chart fees paid service: Handles the chart fees paid command

  {
    days: <Fees Earned Over Days Count Number>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in]: <In Node Public Key or Alias String>
    [is_most_fees_table]: <Is Most Fees Table Bool>
    [is_most_forwarded_table]: <Is Most Forwarded Bool>
    [is_network]: <Show Only Non-Peers In Table Bool>
    [is_peer]: <Show Only Peers In Table Bool>
    lnds: [<Authenticated LND API Object>]
    [out]: <Out Node Public Key or Alias String>
  }

  @returns via Promise
  {
    data: [<Earned Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

@Injectable()
export class ChartFeesPaidService {
  async get(args: chartFeesPaidDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartFeesPaidCommand(args, lnds);

    return { result };
  }
}
