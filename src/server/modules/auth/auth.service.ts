import { HttpException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { authenticationDto } from '~shared/commands.dto';
import { compare } from 'bcryptjs';

/**
  Validate User: Gets the user from the database and compares the password
  {
    username: string,
    password: string
  }
  @returns Promise<boolean | undefined>

  Register User: Creates a new user in the database, throws an error if inserting more than one user
  {
    user: <User Object>
  }
  @returns Promise<boolean>

  Login User: Logs in a user and returns a JWT
  {
    username: string,
    password: string
  }
  @returns via Promise
  {
    accessToken: string
  }
*/

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
