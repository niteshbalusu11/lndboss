import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { chartPaymentsReceivedCommand } from '~server/commands';
import { chartPaymentsReceivedDto } from '~shared/commands.dto';

@Injectable()
export class ChartPaymentsReceivedService {
  async get(args: chartPaymentsReceivedDto): Promise<{ result: any; error: string }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { error, result } = await chartPaymentsReceivedCommand(args, lnds);

    return { error, result };
  }
}
