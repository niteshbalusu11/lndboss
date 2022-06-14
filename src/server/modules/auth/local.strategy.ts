import { HttpException, Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

/*
  Implementation of the local strategy, validate the user's credentials
  Call the auth service to validate the user's credentials
  If the user is valid, return the user's JWT
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException('InvalidUsernameOrPassword', 401);
    }
    return user;
  }
}
