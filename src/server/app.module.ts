import { BalanceModule } from './modules/balance/balance.module';
import { ChainDepositModule } from './modules/chain-deposit/chain-deposit.module';
import { ChartChainFeesModule } from './modules/chart-chain-fees/chart-chain-fees.module';
import { ChartFeesEarnedModule } from './modules/chart-fees-earned/chart-fees-earned.module';
import { ChartFeesPaidModule } from './modules/chart-fees-paid/chart-fees-paid.module';
import { ChartPaymentsReceivedModule } from './modules/chart-payments-received/chart-payments-received.module';
import { LndModule } from './modules/lnd/lnd.module';
import { LoginModule } from './modules/login/login.module';
import { Module } from '@nestjs/common';
import { TagsModule } from './modules/tags/tags.module';
import { ViewModule } from '~server/modules/view/view.module';

@Module({
  imports: [
    BalanceModule,
    ChainDepositModule,
    ChartChainFeesModule,
    ChartFeesEarnedModule,
    ChartFeesPaidModule,
    ChartPaymentsReceivedModule,
    LndModule,
    LoginModule,
    TagsModule,
    ViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
