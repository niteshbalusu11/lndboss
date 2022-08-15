import { Logger, createLogger, format, transports } from 'winston';
import {
  accountingCommand,
  balanceCommand,
  certValidityDaysCommand,
  chainDepositCommand,
  chainfeesCommand,
  chartChainFeesCommand,
  chartFeesEarnedCommand,
  chartFeesPaidCommand,
  chartPaymentsReceivedCommand,
  closedCommand,
  findCommand,
  forwardsCommand,
  graphCommand,
  peersCommand,
  priceCommand,
  probeCommand,
  reconnectCommand,
  sendCommand,
  tagsCommand,
} from '~server/commands';
import {
  accountingDto,
  balanceDto,
  certValidityDaysDto,
  chainDepositDto,
  chainfeesDto,
  chartChainFeesDto,
  chartFeesEarnedDto,
  chartFeesPaidDto,
  chartPaymentsReceivedDto,
  closedDto,
  findDto,
  forwardsDto,
  graphDto,
  peersDto,
  priceDto,
  probeDto,
  reconnectDto,
  sendDto,
  tagsDto,
} from '~shared/commands.dto';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import { removeStyling } from '~server/utils/constants';

@Injectable()
export class CommandsService {
  constructor(private socketService: SocketGateway) {}

  async accountingCommand(args: accountingDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await accountingCommand({ args, lnd });

    return { result };
  }

  async balanceCommand(args: balanceDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await balanceCommand({ args, lnd });

    return { result };
  }

  async certValidityDaysCommand(args: certValidityDaysDto): Promise<{ result: any }> {
    const { result } = await certValidityDaysCommand({ below: args.below, node: args.node });

    return { result: String(result) };
  }

  async chainDepositCommand(args: chainDepositDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await chainDepositCommand({ args, lnd });

    return { result };
  }

  async chainfeesCommand(args: chainfeesDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await chainfeesCommand({ args, lnd });

    return { result };
  }

  async chartChainFeesCommand(args: chartChainFeesDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });
    const { result } = await chartChainFeesCommand({ args, lnd: lnds });

    return { result };
  }

  async chartFeesEarnedCommand(args: chartFeesEarnedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartFeesEarnedCommand({ args, lnd: lnds });

    return { result };
  }

  async chartFeesPaidCommand(args: chartFeesPaidDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartFeesPaidCommand({ args, lnd: lnds });

    return { result };
  }

  async chartPaymentsReceivedCommand(args: chartPaymentsReceivedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await chartPaymentsReceivedCommand({ args, lnd: lnds });

    return { result };
  }

  async closedCommand(args: closedDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await closedCommand({ args, lnd });

    return { result };
  }

  async findCommand(args: findDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await findCommand({ args, lnd });

    return { result };
  }

  async forwardsCommand(args: forwardsDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await forwardsCommand({ args, lnd });

    return { result };
  }

  async graphCommand(args: graphDto): Promise<{ result: any }> {
    const logger: Logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'graph' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await graphCommand({ args, lnd, logger });

    return { result };
  }

  async peersCommand(args: peersDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await peersCommand({ args, lnd });

    return { result };
  }

  async priceCommand(args: priceDto): Promise<{ result: any }> {
    const { result } = await priceCommand(args);

    return { result };
  }

  async probeCommand(args: probeDto): Promise<{ result: any }> {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(args.message_id, {
        message: format.prettyPrint(removeStyling(message)),
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

  async reconnectCommand(args: reconnectDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await reconnectCommand({ lnd });

    return { result };
  }

  async sendCommand(args: sendDto): Promise<{ result: any }> {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(args.message_id, {
        message: format.prettyPrint(removeStyling(message)),
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

  async tagsCommand(args: tagsDto): Promise<{ result: any }> {
    const { result } = await tagsCommand(args);

    return { result };
  }
}
