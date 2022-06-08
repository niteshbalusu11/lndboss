import { BalanceModule } from './modules/balance/balance.module';
import { ChainDepositModule } from './modules/chain-deposit/chain-deposit.module';
import { ChartChainFeesModule } from './modules/chart-chain-fees/chart-chain-fees.module';
import { ChartFeesEarnedModule } from './modules/chart-fees-earned/chart-fees-earned.module';
import { LndModule } from './modules/lnd/lnd.module';
import { LoginModule } from './modules/login/login.module';
import { Module } from '@nestjs/common';
import { ViewModule } from '~server/modules/view/view.module';

@Module({
  imports: [
    BalanceModule,
    ChainDepositModule,
    ChartChainFeesModule,
    ChartFeesEarnedModule,
    LndModule,
    LoginModule,
    ViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
