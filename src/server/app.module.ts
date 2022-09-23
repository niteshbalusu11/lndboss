import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, transports } from 'winston';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BosloggerModule } from './modules/boslogger/boslogger.module';
import { CommandsModule } from './modules/commands/commands.module';
import { ConfigModule } from '@nestjs/config';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { CronModule } from './modules/cron/cron.module';
import { ExternalServicesModule } from './modules/external-services/external-services.module';
import { FeesModule } from './modules/fees/fees.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LndModule } from './modules/lnd/lnd.module';
import { Module } from '@nestjs/common';
import { RebalanceModule } from './modules/rebalance/rebalance.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SocketModule } from './modules/socket/socket.module';
import { ViewModule } from '~server/modules/view/view.module';
import { homedir } from 'os';
import { join } from 'path';

// App Module: Global Module for the entire application

@Module({
  imports: [
    AuthModule,
    CredentialsModule,
    CommandsModule,
    CronModule,
    ExternalServicesModule,
    FeesModule,
    GrpcModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', join(homedir(), '.bosgui', '.env')],
    }),
    LndModule,
    BosloggerModule,
    RebalanceModule,
    ScheduleModule.forRoot(),
    SocketModule,
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
