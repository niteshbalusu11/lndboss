import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartChainFeesCommand } from '~server/commands';
import { chartChainFeesDto } from '~shared/commands.dto';

/** ChartChainFees service: Handles the chart-chain-fees command

  {
    days: <Chain Fees Paid Over Days Count Number>
    is_monochrome: <Omit Colors Bool>
    lnds: [<Authenticated LND API Object>]
    request: <Request Function>
  }

  @returns via Promise
  {
    data: [<Chain Fee Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

@Injectable()
export class ChartChainFeesService {
  async get(args: chartChainFeesDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });
    const { result } = await chartChainFeesCommand({ args, lnd: lnds });

    return { result };
  }
}
