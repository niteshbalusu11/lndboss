import { Controller, Get, Query } from '@nestjs/common';
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
  payDto,
  peersDto,
  priceDto,
  probeDto,
  reconnectDto,
  sendDto,
  tagsDto,
} from '~shared/commands.dto';
import { CommandsService } from './commands.service';

@Controller('api')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Get('accounting')
  async accountingCommand(@Query() args: accountingDto) {
    return this.commandsService.accountingCommand(args);
  }

  @Get('balance')
  async balanceCommand(@Query() args: balanceDto) {
    return this.commandsService.balanceCommand(args);
  }

  @Get('cert-validity-days')
  async certValidityDaysCommand(@Query() args: certValidityDaysDto) {
    return this.commandsService.certValidityDaysCommand(args);
  }

  @Get('chain-deposit')
  async chainDepositCommand(@Query() args: chainDepositDto) {
    return this.commandsService.chainDepositCommand(args);
  }

  @Get('chainfees')
  async chainfeesCommand(@Query() args: chainfeesDto) {
    return this.commandsService.chainfeesCommand(args);
  }

  @Get('chart-chain-fees')
  async chartChainFeesCommand(@Query() args: chartChainFeesDto) {
    return this.commandsService.chartChainFeesCommand(args);
  }

  @Get('chart-fees-earned')
  async chartFeesEarnedCommand(@Query() args: chartFeesEarnedDto) {
    return this.commandsService.chartFeesEarnedCommand(args);
  }

  @Get('chart-fees-paid')
  async chartFeesPaidCommand(@Query() args: chartFeesPaidDto) {
    return this.commandsService.chartFeesPaidCommand(args);
  }

  @Get('chart-payments-received')
  async chartPaymentsReceivedCommand(@Query() args: chartPaymentsReceivedDto) {
    return this.commandsService.chartPaymentsReceivedCommand(args);
  }

  @Get('closed')
  async closedCommand(@Query() args: closedDto) {
    return this.commandsService.closedCommand(args);
  }

  @Get('find')
  async findCommand(@Query() args: findDto) {
    return this.commandsService.findCommand(args);
  }

  @Get('forwards')
  async forwardsCommand(@Query() args: forwardsDto) {
    return this.commandsService.forwardsCommand(args);
  }

  @Get('graph')
  async graphCommand(@Query() args: graphDto) {
    return this.commandsService.graphCommand(args);
  }

  @Get('pay')
  async payCommand(@Query() args: payDto) {
    return this.commandsService.payCommand(args);
  }

  @Get('peers')
  async peersCommand(@Query() args: peersDto) {
    return this.commandsService.peersCommand(args);
  }

  @Get('price')
  async priceCommand(@Query() args: priceDto) {
    return this.commandsService.priceCommand(args);
  }

  @Get('probe')
  async probeCommand(@Query() args: probeDto) {
    return this.commandsService.probeCommand(args);
  }

  @Get('reconnect')
  async reconnectCommand(@Query() args: reconnectDto) {
    return this.commandsService.reconnectCommand(args);
  }

  @Get('send')
  async sendCommand(@Query() args: sendDto) {
    return this.commandsService.sendCommand(args);
  }

  @Get('tags')
  async tagsCommand(@Query() args: tagsDto) {
    return this.commandsService.tagsCommand(args);
  }
}
