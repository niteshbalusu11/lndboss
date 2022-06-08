import { Body, Controller, Post } from '@nestjs/common';
import { loginDto } from '~shared/commands.dto';

import { LoginService } from './login.service';

@Controller('api/login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(@Body() args: loginDto) {
    return this.loginService.post(args);
  }
}
