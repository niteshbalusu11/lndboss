import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { Module } from '@nestjs/common';

// Credentials module: Module for the credentials service

@Module({
  providers: [CredentialsService],
  controllers: [CredentialsController],
})
export class CredentialsModule {}
