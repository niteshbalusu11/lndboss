import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import * as dto from '~shared/commands.dto';

import { CommandsService } from './commands.service';

/**
 * CommandsController: Controller for handling bos commands
 * Takes in a request body, calls the appropriate commands service, and returns the result
 */

@Controller('api')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Get('accounting')
  async accountingCommand(@Query() args: dto.accountingDto) {
    return this.commandsService.accountingCommand(args);
  }

  @Get('balance')
  async balanceCommand(@Query() args: dto.balanceDto) {
    return this.commandsService.balanceCommand(args);
  }

  @Post('call')
  async callCommand(@Body() args) {
    return this.commandsService.callCommand(args);
  }

  @Get('cert-validity-days')
  async certValidityDaysCommand(@Query() args: dto.certValidityDaysDto) {
    return this.commandsService.certValidityDaysCommand(args);
  }

  @Get('chain-deposit')
  async chainDepositCommand(@Query() args: dto.chainDepositDto) {
    return this.commandsService.chainDepositCommand(args);
  }

  @Get('chainfees')
  async chainfeesCommand(@Query() args: dto.chainfeesDto) {
    return this.commandsService.chainfeesCommand(args);
  }

  @Get('chart-chain-fees')
  async chartChainFeesCommand(@Query() args: dto.chartChainFeesDto) {
    return this.commandsService.chartChainFeesCommand(args);
  }

  @Get('chart-fees-earned')
  async chartFeesEarnedCommand(@Query() args: dto.chartFeesEarnedDto) {
    return this.commandsService.chartFeesEarnedCommand(args);
  }

  @Get('chart-fees-paid')
  async chartFeesPaidCommand(@Query() args: dto.chartFeesPaidDto) {
    return this.commandsService.chartFeesPaidCommand(args);
  }

  @Get('chart-payments-received')
  async chartPaymentsReceivedCommand(@Query() args: dto.chartPaymentsReceivedDto) {
    return this.commandsService.chartPaymentsReceivedCommand(args);
  }

  @Get('closed')
  async closedCommand(@Query() args: dto.closedDto) {
    return this.commandsService.closedCommand(args);
  }

  @Get('find')
  async findCommand(@Query() args: dto.findDto) {
    return this.commandsService.findCommand(args);
  }

  @Get('forwards')
  async forwardsCommand(@Query() args: dto.forwardsDto) {
    return this.commandsService.forwardsCommand(args);
  }

  @Get('graph')
  async graphCommand(@Query() args: dto.graphDto) {
    return this.commandsService.graphCommand(args);
  }

  @Get('lnurl')
  async lnurlCommand(@Query() args: dto.lnurlDto) {
    return this.commandsService.lnurlCommand(args);
  }

  @Post('open')
  async openCommand(@Body() args: dto.openDto) {
    return this.commandsService.openCommand(args);
  }

  @Post('validate-open')
  async openCommandValidation(@Body() args: dto.openDto) {
    return this.commandsService.openCommandValidation(args);
  }

  @Get('pay')
  async payCommand(@Query() args: dto.payDto) {
    return this.commandsService.payCommand(args);
  }

  @Get('peers')
  async peersCommand(@Query() args: dto.peersDto) {
    return this.commandsService.peersCommand(args);
  }

  @Get('price')
  async priceCommand(@Query() args: dto.priceDto) {
    return this.commandsService.priceCommand(args);
  }

  @Get('probe')
  async probeCommand(@Query() args: dto.probeDto) {
    return this.commandsService.probeCommand(args);
  }

  @Get('reconnect')
  async reconnectCommand(@Query() args: dto.reconnectDto) {
    return this.commandsService.reconnectCommand(args);
  }

  @Get('send')
  async sendCommand(@Query() args: dto.sendDto) {
    return this.commandsService.sendCommand(args);
  }

  @Post('settings')
  async settings(@Body() args) {
    return this.commandsService.settings(args);
  }

  @Get('tags')
  async tagsCommand(@Query() args: dto.tagsDto) {
    return this.commandsService.tagsCommand(args);
  }
}
