import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import { deleteRebalanceDto, rebalanceDto, rebalanceScheduleDto } from '~shared/commands.dto';

import { BosloggerService } from '../boslogger/boslogger.service';
import { CronService } from '../cron/cron.service';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import { httpLogger } from '~server/utils/global_functions';
import manageRebalanceTriggers from '~server/commands/rebalance/manage_rebalance_triggers';
import { rebalanceCommand } from '~server/commands';
import { removeStyling } from '~server/utils/constants';

const actionAddRebalanceTrigger = 'action-add-rebalance-trigger';
const actionDeleteRebalanceTrigger = 'action-delete-trigger';
const actionListRebalancesTriggers = 'action-list-triggers';

/** Manage rebalance attempts

Rebalance
  {
    [avoid]: [<Avoid Forwarding Through Node With Public Key Hex String>]
    [in_filters]: [<Inbound Filter Formula String>]
    [in_outbound]: <Inbound Target Outbound Liquidity Tokens Number>
    [in_through]: <Pay In Through Peer String>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [max_rebalance]: <Maximum Amount to Rebalance Tokens String>
    message_id: <Emitter Message ID String>
    [node]: <Node Name String>
    [out_filters]: [<Outbound Filter Formula String>]
    [out_inbound]: <Outbound Target Inbound Liquidity Tokens Number>
    [out_through]: <Pay Out Through Peer String>
    [timeout_minutes]: <Deadline To Stop Rebalance Minutes Number>
  }
  @returns via or Promise

  Get Scheduled Rebalances

  @returns via Promise
  {
    id: <Rebalance ID Array String>
    rebalance_data: <Rebalance Data JSON Array String>
  }

  Delete Scheduled Rebalances
  {
    [node]: <Node Name String>
    [id]: <Rebalance ID String>
  }

  @returns via Promise


  Schedule a rebalance
  {
    [avoid]: [<Avoid Forwarding Through Node With Public Key Hex String>]
    [in_filters]: [<Inbound Filter Formula String>]
    [in_outbound]: <Inbound Target Outbound Liquidity Tokens Number>
    [in_through]: <Pay In Through Peer String>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
    [max_fee]: <Maximum Fee Tokens Number>
    [max_fee_rate]: <Max Fee Rate Tokens Per Million Number>
    [max_rebalance]: <Maximum Amount to Rebalance Tokens String>
    message_id: <Emitter Message ID String>
    [node]: <Node Name String>
    [out_filters]: [<Outbound Filter Formula String>]
    [out_inbound]: <Outbound Target Inbound Liquidity Tokens Number>
    [out_through]: <Pay Out Through Peer String>
    schedule: <Cron Schedule String>
    [timeout_minutes]: <Deadline To Stop Rebalance Minutes Number>
  }

  @returns via Promise
  {
  validate: undefined,
  description: <Rebalance Description Hex Encoded String>,
  create: {
    chain_address: undefined,
    created_at: <Date String>,
    description: <Rebalance Description Hex Encoded String>,
    id: <Rebalance (Invoice) ID String>,
  }
*/

@Injectable()
export class RebalanceService implements OnModuleInit {
  constructor(
    private socketService: SocketGateway,
    private cronService: CronService,
    private logger: BosloggerService
  ) {}

  // On module init, get saved nodes and fetch rebalances and add to cron jobs
  async onModuleInit() {
    this.initRebalances();
  }

  // Run on module init
  async initRebalances() {
    try {
      const { result } = await this.getRebalances();

      if (!!result && !!result.length) {
        result.forEach(rebalance => this.cronService.createRebalanceCron({ args: rebalance.rebalance_data, id: rebalance.id }))
      }

    } catch (error) {
      this.logger.log({ type: 'error', message: error.message });
    }
  }

  // Create logger
  createLogger({ messageId }: { messageId: string }): Logger {
    const emit = this.socketService.server.emit.bind(this.socketService.server);

    const myFormat = format.printf(({ message }) => {
      return emit(messageId, {
        message: format.prettyPrint(removeStyling(message)),
      });
    });

    const logger: Logger = createLogger({
      level: 'info',
      format: format.combine(myFormat),
      defaultMeta: { service: 'rebalance' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    return logger;
  }

  // Delete a rebalance cron job
  async deleteRebalance(args: deleteRebalanceDto): Promise<{ result: any }> {
    try {
      await manageRebalanceTriggers({
        action: actionDeleteRebalanceTrigger,
        id: args.id,
      });

      await this.cronService.deleteCron({ name: args.id });

      return { result: 'rebalanceScheduleDeleted' };
    } catch (error) {
      httpLogger({ error });
    }
  }

  // Get a list of rebalance cron jobs
  async getRebalances(): Promise<{ result: any }> {
    try {
      const result = await manageRebalanceTriggers({
        action: actionListRebalancesTriggers,
      });

      return { result: result.getTriggers };
    } catch (error) {
      httpLogger({ error });
    }
  }

  // Manual rebalance
  async rebalance(args: rebalanceDto | rebalanceScheduleDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });
    const logger = this.createLogger({ messageId: args.message_id });

    const { result } = await rebalanceCommand({
      args,
      lnd,
      logger,
    });

    return { result };
  }

  // Schedule a rebalance
  async scheduleRebalance(args: rebalanceScheduleDto): Promise<{ result: any }> {
    try {
      const stringify = (obj: any) => JSON.stringify(obj);
      const lnd = await LndService.authenticatedLnd({ node: args.node });

      const result = await manageRebalanceTriggers({
        lnd,
        action: actionAddRebalanceTrigger,
        data: stringify(args),
      });

      if (!!result.createRebalanceTrigger) {
        this.cronService.createRebalanceCron({ args, id: result.createRebalanceTrigger.id });
      }

      return { result: result.createRebalanceTrigger };
    } catch (error) {
      httpLogger({ error })
    }
  }
}
