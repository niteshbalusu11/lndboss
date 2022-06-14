import { HttpException, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { getAccountInfo, register } from '~server/authentication';

import { authenticationDto } from '~shared/commands.dto';

const { parse } = JSON;

/**
  Users Service: Handles requests from auth service
  Register: Registers a new user
  {
    username: <Username String>
    password: <Password String>
  }
  @returns via Promise
  {
    result: <Success Boolean>
  }

  findOne: Finds a user by username
  {
    username: <Username String>
  }
  @returns via Promise
  {
    result: <User Object>
  }

  isRegistered: Checks if a user is registered
  @returns via Promise
  {
    result: <Success/Failure Boolean>
  }
 */

export type UserInfo = {
  username: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  async register(user: authenticationDto) {
    const salt = await genSalt(10);

    const passwordHash = await hash(user.password, salt);
    const result = await register({ username: user.username, passwordHash });

    return result;
  }

  async findOne(username: string): Promise<UserInfo | undefined> {
    const result = await getAccountInfo();

    if (!result) {
      return undefined;
    }

    try {
      parse(result);
    } catch (e) {
      throw new HttpException('ErrorParsingCredentialsFile', 500);
    }

    const userInfo = parse(result);

    if (username === userInfo.username) {
      return userInfo;
    }
    return undefined;
  }

  async isRegistered(): Promise<boolean> {
    const result = await getAccountInfo();

    if (!result) {
      return false;
    }

    try {
      parse(result);
    } catch (e) {
      throw new HttpException('ErrorParsingCredentialsFile', 500);
    }

    const userInfo = parse(result);

    if (!!userInfo.username && !!userInfo.passwordHash) {
      return true;
    }
    return false;
  }
}
