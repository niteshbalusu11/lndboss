import { AuthenticationService } from './authentication.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { authenticationDto } from '~shared/commands.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService, private jwtService: JwtService) {}

  @Post('/register')
  async Signup(@Res() response, @Body() user: authenticationDto) {
    console.log(user);
    const newUSer = await this.authenticationService.signup(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Post('/login')
  async SignIn(@Res() response, @Body() user: authenticationDto) {
    const token = await this.authenticationService.login(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }
}
