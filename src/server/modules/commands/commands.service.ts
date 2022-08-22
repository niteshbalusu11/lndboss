import * as commands from '~server/commands';
import * as dto from '~shared/commands.dto';

import { Logger, createLogger, format, transports } from 'winston';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import { httpLogger } from '~server/utils/global_functions';
import { removeStyling } from '~server/utils/constants';

/**
 * CommandsService: Service for handling bos commands
 * Takes in a request body, calls the appropriate command, and returns the result
 */

@Injectable()
export class CommandsService {
  constructor(private socketService: SocketGateway) {}

  async logger({ messageId, service }) {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(messageId, {
        message: format.prettyPrint(removeStyling(message)),
      });
    });

    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(myFormat),
      defaultMeta: { service },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    return logger;
  }

  async accountingCommand(args: dto.accountingDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.accountingCommand({ args, lnd });

    return { result };
  }

  async balanceCommand(args: dto.balanceDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.balanceCommand({ args, lnd });

    return { result };
  }

  async certValidityDaysCommand(args: dto.certValidityDaysDto): Promise<{ result: any }> {
    const { result } = await commands.certValidityDaysCommand({ below: args.below, node: args.node });

    return { result: String(result) };
  }

  async chainDepositCommand(args: dto.chainDepositDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.chainDepositCommand({ args, lnd });

    return { result };
  }

  async chainfeesCommand(args: dto.chainfeesDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.chainfeesCommand({ args, lnd });

    return { result };
  }

  async chartChainFeesCommand(args: dto.chartChainFeesDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });
    const { result } = await commands.chartChainFeesCommand({ args, lnd: lnds });

    return { result };
  }

  async chartFeesEarnedCommand(args: dto.chartFeesEarnedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await commands.chartFeesEarnedCommand({ args, lnd: lnds });

    return { result };
  }

  async chartFeesPaidCommand(args: dto.chartFeesPaidDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await commands.chartFeesPaidCommand({ args, lnd: lnds });

    return { result };
  }

  async chartPaymentsReceivedCommand(args: dto.chartPaymentsReceivedDto): Promise<{ result: any }> {
    const lnds = await LndService.getLnds({ nodes: args.nodes });

    const { result } = await commands.chartPaymentsReceivedCommand({ args, lnd: lnds });

    return { result };
  }

  async closedCommand(args: dto.closedDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.closedCommand({ args, lnd });

    return { result };
  }

  async findCommand(args: dto.findDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.findCommand({ args, lnd });

    return { result };
  }

  async forwardsCommand(args: dto.forwardsDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.forwardsCommand({ args, lnd });

    return { result };
  }

  async graphCommand(args: dto.graphDto): Promise<{ result: any }> {
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

    const { result } = await commands.graphCommand({ args, lnd, logger });

    return { result };
  }


  async lnurlCommand(args: dto.lnurlDto): Promise<{ result: any }> {
    try {
      const logger = await this.logger({ messageId: args.message_id, service: 'lnurl' });

      const lnd = await LndService.authenticatedLnd({ node: args.node });

      const result = await commands.lnurlCommand({ args, lnd, logger });

      return { result };
    } catch (error) {
      httpLogger({ error });
    }
  }

  async payCommand(args: dto.payDto): Promise<{ result: any }> {
    const logger = await this.logger({ messageId: args.message_id, service: 'pay' });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.payCommand({
      args,
      lnd,
      logger,
    });

    return { result };
  }

  async peersCommand(args: dto.peersDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.peersCommand({ args, lnd });

    return { result };
  }

  async priceCommand(args: dto.priceDto): Promise<{ result: any }> {
    const { result } = await commands.priceCommand({ args });

    return { result };
  }

  async probeCommand(args: dto.probeDto): Promise<{ result: any }> {
    const logger = await this.logger({ messageId: args.message_id, service: 'probe' });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.probeCommand({ args, lnd, logger });

    return { result };
  }

  async reconnectCommand(args: dto.reconnectDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.reconnectCommand({ lnd });

    return { result };
  }

  async sendCommand(args: dto.sendDto): Promise<{ result: any }> {
    const logger = await this.logger({ messageId: args.message_id, service: 'send' });

    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await commands.sendCommand({
      args,
      lnd,
      logger,
    });

    return { result };
  }

  async tagsCommand(args: dto.tagsDto): Promise<{ result: any }> {
    const { result } = await commands.tagsCommand({ args });

    return { result };
  }
}
