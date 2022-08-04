import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, transports } from 'winston';

import { AccountingModule } from './modules/accounting/accounting.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceModule } from './modules/balance/balance.module';
import { BosloggerModule } from './modules/boslogger/boslogger.module';
import { CertValidityDaysModule } from './modules/cert-validity-days/cert-validity-days.module';
import { ChainDepositModule } from './modules/chain-deposit/chain-deposit.module';
import { ChainfeesModule } from './modules/chainfees/chainfees.module';
import { ChartChainFeesModule } from './modules/chart-chain-fees/chart-chain-fees.module';
import { ChartFeesEarnedModule } from './modules/chart-fees-earned/chart-fees-earned.module';
import { ChartFeesPaidModule } from './modules/chart-fees-paid/chart-fees-paid.module';
import { ChartPaymentsReceivedModule } from './modules/chart-payments-received/chart-payments-received.module';
import { ClosedModule } from './modules/closed/closed.module';
import { ConfigModule } from '@nestjs/config';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { CronModule } from './modules/cron/cron.module';
import { ExternalServicesModule } from './modules/external-services/external-services.module';
import { FindModule } from './modules/find/find.module';
import { ForwardsModule } from './modules/forwards/forwards.module';
import { GraphModule } from './modules/graph/graph.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LndModule } from './modules/lnd/lnd.module';
import { Module } from '@nestjs/common';
import { PeersModule } from './modules/peers/peers.module';
import { PriceModule } from './modules/price/price.module';
import { ProbeModule } from './modules/probe/probe.module';
import { RebalanceModule } from './modules/rebalance/rebalance.module';
import { ReconnectModule } from './modules/reconnect/reconnect.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SendModule } from './modules/send/send.module';
import { SocketModule } from './modules/socket/socket.module';
import { TagsModule } from './modules/tags/tags.module';
import { ViewModule } from '~server/modules/view/view.module';
import { homedir } from 'os';
import { join } from 'path';

// App Module: Global Module for the entire application

@Module({
  imports: [
    AccountingModule,
    AuthModule,
    BalanceModule,
    CertValidityDaysModule,
    ChainDepositModule,
    ChainfeesModule,
    ChartChainFeesModule,
    ChartFeesEarnedModule,
    ChartFeesPaidModule,
    ChartPaymentsReceivedModule,
    ClosedModule,
    CredentialsModule,
    CronModule,
    ExternalServicesModule,
    FindModule,
    ForwardsModule,
    GraphModule,
    GrpcModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', join(homedir(), '.bosgui', '.env')],
    }),
    LndModule,
    BosloggerModule,
    PeersModule,
    PriceModule,
    ProbeModule,
    RebalanceModule,
    ReconnectModule,
    ScheduleModule.forRoot(),
    SendModule,
    SocketModule,
    TagsModule,
    ViewModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        levels: {
          error: 0,
          warn: 1,
          info: 2,
        },
        transports: [
          new transports.Console({
            format: format.combine(format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          }),
        ],
      }),
    }),
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
