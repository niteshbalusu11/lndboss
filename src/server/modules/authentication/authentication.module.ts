import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtService],
})
export class AuthenticationModule {}
