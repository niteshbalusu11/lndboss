import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { deleteRebalanceDto, rebalanceDto, rebalanceScheduleDto } from '~shared/commands.dto';
import { RebalanceService } from './rebalance.service';

// Rebalance controller: Defines routes for rebalance command

@Controller()
export class RebalanceController {
  constructor(private rebalanceService: RebalanceService) {}
  @Post('api/rebalance/schedule')
  async scheduleRebalance(@Body() args: rebalanceScheduleDto) {
    return this.rebalanceService.scheduleRebalance(args);
  }

  @Get('api/rebalance')
  async rebalance(@Query() args: rebalanceDto) {
    return this.rebalanceService.rebalance(args);
  }

  @Get('api/rebalance/getrebalances')
  async getRebalances() {
    return this.rebalanceService.getRebalances();
  }

  @Get('api/rebalance/deleterebalance')
  async deleteRebalance(@Query() args: deleteRebalanceDto) {
    return this.rebalanceService.deleteRebalance(args);
  }
}
