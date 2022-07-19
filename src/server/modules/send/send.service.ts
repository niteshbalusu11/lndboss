import { Logger, createLogger, format, transports } from 'winston';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import { sendCommand } from '~server/commands';
import { sendDto } from '~shared/commands.dto';

/** Push a payment to a destination

  {
    amount: <Amount to Push Tokens String>
    avoid: [<Avoid Forwarding Through String>]
    destination: <Destination Public Key Hex String>
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
    [in_through]: <Pay In Through Peer String>
    [is_dry_run]: <Do Not Push Payment Bool>
    [is_omitting_message_from]: <Do Not Include From Key In Message Bool>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    max_fee: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [message]: <Message to Include With Payment String>
    [out_through]: <Pay Out Through Peer String>
    request: <Request Function>
    [timeout_minutes]: <Stop Searching For Route After N Minutes Number>
  }
*/

@Injectable()
export class SendService {
  constructor(private socketService: SocketGateway) {}

  // Push payment
  async send(args: sendDto): Promise<{ result: any }> {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(args.message_id, {
        message: format.prettyPrint(message),
      });
    });

    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(myFormat),
      defaultMeta: { service: 'send' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await sendCommand({
      args,
      lnd,
      logger,
    });

    return { result };
  }
}
