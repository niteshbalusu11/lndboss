import { AccountingModule } from './modules/accounting/accounting.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CertValidityDaysModule } from './modules/cert-validity-days/cert-validity-days.module';
import { ChainDepositModule } from './modules/chain-deposit/chain-deposit.module';
import { ChartChainFeesModule } from './modules/chart-chain-fees/chart-chain-fees.module';
import { ChartFeesEarnedModule } from './modules/chart-fees-earned/chart-fees-earned.module';
import { ChartFeesPaidModule } from './modules/chart-fees-paid/chart-fees-paid.module';
import { ChartPaymentsReceivedModule } from './modules/chart-payments-received/chart-payments-received.module';
import { ClosedModule } from './modules/closed/closed.module';
import { ConfigModule } from '@nestjs/config';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LndModule } from './modules/lnd/lnd.module';
import { Module } from '@nestjs/common';
import { TagsModule } from './modules/tags/tags.module';
import { ViewModule } from '~server/modules/view/view.module';

// App Module: Global Module for the entire application

@Module({
  imports: [
    AccountingModule,
    AuthModule,
    BalanceModule,
    CertValidityDaysModule,
    ChainDepositModule,
    ChartChainFeesModule,
    ChartFeesEarnedModule,
    ChartFeesPaidModule,
    CredentialsModule,
    ChartPaymentsReceivedModule,
    ClosedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    LndModule,
    TagsModule,
    ViewModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
