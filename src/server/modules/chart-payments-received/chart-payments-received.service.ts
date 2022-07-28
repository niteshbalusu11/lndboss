import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartPaymentsReceivedCommand } from '~server/commands';
import { chartPaymentsReceivedDto } from '~shared/commands.dto';

/** ChartPaymentsReceived Service: Handles routes to the chart-payments-received service

  {
    [days]: <Received Over Days Count Number>
    lnds: [<Authenticated LND API Object>]
  }

  @returns via Promise
  {
    data: [<Received Tokens Number>]
    description: <Chart Description String>
    title: <Chart Title String>
  }
*/

@Injectable()
export class ChartPaymentsReceivedService {
  async get(args: chartPaymentsReceivedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartPaymentsReceivedCommand(args, lnds);

    return { result };
  }
}
