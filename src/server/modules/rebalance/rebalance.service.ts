import { Injectable, OnModuleInit } from '@nestjs/common';
import { deleteRebalanceDto, getRebalancesDto, rebalanceDto, rebalanceScheduleDto } from '~shared/commands.dto';

import { CronJob } from 'cron';
import { CronService } from '../cron/cron.service';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import manageRebalanceTriggers from '~server/commands/rebalance/manage_rebalance_triggers';
import { rebalanceCommand } from '~server/commands';

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
  {
    [node]: <Node Name String>
  }

  @returns via Promise
  {
    invoice_id: <Invoice ID Array String>
    rebalance_data: <Rebalance Data JSON Array String>
  }

  Delete Scheduled Rebalances
  {
    [node]: <Node Name String>
    [invoice_id]: <Invoice ID String>
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
    created_at:
  }
*/

@Injectable()
export class RebalanceService implements OnModuleInit {
  constructor(private socketService: SocketGateway) {}
  async onModuleInit() {
    const args = {
      node: '',
    };

    this.rebalanceCron('45 * * * * *');
  }

  async deleteRebalance(args: deleteRebalanceDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    await manageRebalanceTriggers({
      lnd,
      action: actionDeleteRebalanceTrigger,
      id: args.invoice_id,
    });

    return { result: 'rebalanceScheduleDeleted' };
  }

  async getRebalances(args: getRebalancesDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await manageRebalanceTriggers({
      action: actionListRebalancesTriggers,
      lnd,
    });

    return { result: result.getTriggers };
  }

  async rebalance(args: rebalanceDto | rebalanceScheduleDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await rebalanceCommand({
      args,
      lnd,
      emit: this.socketService.server.emit.bind(this.socketService.server),
    });

    return { result };
  }

  async scheduleRebalance(args: rebalanceScheduleDto): Promise<{ result: any }> {
    const stringify = (obj: any) => JSON.stringify(obj);
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await manageRebalanceTriggers({
      lnd,
      action: actionAddRebalanceTrigger,
      data: stringify(args),
    });

    if (!!result.createRebalanceTrigger) {
      CronService.createRebalanceCron(args);
    }

    return { result: result.createRebalanceTrigger };
  }

  async rebalanceCron(args) {
    const job = new CronJob(`${args}`, () => {
      console.log(`time to run!`);
    });

    job.start();
  }
}
