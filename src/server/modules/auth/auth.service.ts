import { HttpException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { authenticationDto } from '~shared/commands.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<boolean | undefined> {
    const user = await this.usersService.findOne(username);

    if (!!user && (await compare(password, user.passwordHash))) {
      return true;
    }
    return undefined;
  }

  async registerUser(user: authenticationDto) {
    const result = await this.usersService.isRegistered();

    if (!!result) {
      throw new HttpException('OnlyOneUserRegistrationIsAllowed', 401);
    }

    return await this.usersService.register(user);
  }

  async login(user: authenticationDto): Promise<{ accessToken: string }> {
    const payload = { username: user.username, sub: user.username };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
