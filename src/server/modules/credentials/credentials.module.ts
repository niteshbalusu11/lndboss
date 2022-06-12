import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [CredentialsService],
  controllers: [CredentialsController],
})
export class CredentialsModule {}
