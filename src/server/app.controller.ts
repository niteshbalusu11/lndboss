import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from '~server/modules/auth/local-auth.guard';
import { AuthService } from '~server/modules/auth/auth.service';
import { authenticationDto } from '~shared/commands.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Body() body: authenticationDto) {
    return this.authService.login(body);
  }

  @Post('api/auth/register')
  async register(@Body() body: authenticationDto) {
    return this.authService.registerUser(body);
  }
}
