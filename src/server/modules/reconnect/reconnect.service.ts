import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { reconnectCommand } from '~server/commands';
import { reconnectDto } from '~shared/commands.dto';

/** Get channel peers that are disconnected and attempt to reconnect

  This method will also disconnect peers that are connected, but have inactive
  channels.

  {
    node: <Saved Node String>
  }

  @returns via Promise
  {
    reconnected: [{
      alias: <Node Alias String>
      public_key: <Node Identity Public Key Hex String
    }]
  }
*/

type Result = {
  result: {
    offline: string[];
    reconnected: string[];
  };
};
@Injectable()
export class ReconnectService {
  async reconnect(args: reconnectDto): Promise<{ result: Result }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await reconnectCommand({ lnd });

    return { result };
  }
}
