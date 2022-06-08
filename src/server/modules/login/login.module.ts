import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
