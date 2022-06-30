import { rebalanceDto, rebalanceScheduleDto } from '~shared/commands.dto';

import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { SocketGateway } from '../socket/socket.gateway';
import manageRebalanceTriggers from '~server/commands/rebalance/manage_rebalance_triggers';
import { rebalanceCommand } from '~server/commands';

const actionAddRebalanceTrigger = 'action-add-rebalance-trigger';
const actionDeleteTrigger = 'action-delete-trigger';
const actionListTriggers = 'action-list-triggers';

/** Manage rebalance attempts

  {
    [avoid]: [<Avoid Forwarding Through Node With Public Key Hex String>]
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
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

  @returns via Promise
*/

@Injectable()
export class RebalanceService {
  constructor(private socketService: SocketGateway) {}

  async rebalance(args: rebalanceDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await rebalanceCommand({
      args,
      lnd,
      emit: this.socketService.server.emit.bind(this.socketService.server),
    });

    return { result };
  }

  async scheduleRebalance(args: rebalanceScheduleDto): Promise<{ result: any }> {
    const id = Date.now().toString();
    const stringify = (obj: any) => JSON.stringify(obj);
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await manageRebalanceTriggers({
      id,
      lnd,
      action: actionAddRebalanceTrigger,
      data: stringify(args),
    });

    return { result: result.createRebalanceTrigger };
  }

  async getRebalances(args: { node: string }): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await manageRebalanceTriggers({
      action: actionListTriggers,
      lnd,
    });

    return { result: result.getTriggers };
  }

  async deleteRebalance(args: { node: string; invoice_id: string }): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const result = await manageRebalanceTriggers({
      action: actionDeleteTrigger,
      invoiceId: args.invoice_id,
      lnd,
    });

    return { result: result.deleteTrigger };
  }
}
