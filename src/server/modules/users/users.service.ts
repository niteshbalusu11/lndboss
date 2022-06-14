import { genSalt, hash } from 'bcrypt';
import { getAccountInfo, register } from '~server/authentication';

import { Injectable } from '@nestjs/common';
import { authenticationDto } from '~shared/commands.dto';

const { parse } = JSON;

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  async register(user: authenticationDto) {
    const salt = await genSalt(10);

    const passwordHash = await hash(user.password, salt);
    const result = await register({ username: user.username, passwordHash });

    return result;
  }

  async findOne(username: string): Promise<User | undefined> {
    const result = await getAccountInfo();

    const userInfo = parse(result);

    if (username === userInfo.username) {
      return userInfo;
    }
    return undefined;
  }
}
