import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { getAccountInfo, register } from '~server/authentication';

import { JwtService } from '@nestjs/jwt';
import { authenticationDto } from '~shared/commands.dto';

const { parse } = JSON;

@Injectable()
export class AuthenticationService {
  async signup(user: authenticationDto) {
    const salt = await genSalt();
    const passwordHash = await hash(user.password, salt);

    const result = await register({
      passwordHash,
      accountName: user.accountName,
    });
    return result;
  }

  async login(user: authenticationDto, jwt: JwtService): Promise<any> {
    const result = await getAccountInfo();

    if (!result) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userInfo = parse(result);

    if (user.accountName === userInfo.accountName) {
      if (compare(user.password, userInfo.passwordHash)) {
        const payload = { accountName: user.accountName };
        return {
          token: jwt.sign(payload),
        };
      }
      return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED);
    }
    return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED);
  }

  async getOne(accountName: string) {
    const result = await getAccountInfo();
    const userInfo = parse(result);
    if (userInfo.accountName !== accountName) {
      return false;
    }

    return true;
  }
}
