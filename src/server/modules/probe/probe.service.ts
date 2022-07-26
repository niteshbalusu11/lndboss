import { Logger, createLogger, format, transports } from 'winston';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import { probeCommand } from '~server/commands';
import { probeDto } from '~shared/commands.dto';

/** Probe a destination, looking for multiple non-overlapping paths

  {
    avoid: [<Avoid Forwarding Through String>]
    [destination]: <Destination Public Key Hex String>
    [find_max]: <Find Maximum Payable On Probed Routes Below Tokens Number>
    [fs]: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in_through]: <Pay In Through Public Key Hex String>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    [max_paths]: <Maximum Probe Paths Number>
    out: [<Out Through Peer With Public Key Hex String>]
    [request]: <BOLT 11 Encoded Payment Request String>
    [timeout_minutes]: <Stop Searching For Routes After N Minutes Number>
    [tokens]: <Tokens Amount String>
  }

  @returns via Promise
  {
    [fee]: <Total Fee Tokens To Destination Number>
    [latency_ms]: <Latency Milliseconds Number>
    [relays]: [[<Relaying Public Key Hex String>]]
    [routes_maximum]: <Maximum Sendable Tokens on Paths Number>
  }
*/

type Return = {
  fee: number;
  latency_ms: number;
  relays: string[];
  routes_maximum: number;
};

@Injectable()
export class ProbeService {
  constructor(private socketService: SocketGateway) {}

  async probe(args: probeDto): Promise<{ result: Return }> {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(args.message_id, {
        message: format.prettyPrint(message),
      });
    });

    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(myFormat),
      defaultMeta: { service: 'probe' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await probeCommand({ args, lnd, logger });

    return { result };
  }
}
