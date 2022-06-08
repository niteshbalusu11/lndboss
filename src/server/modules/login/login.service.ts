import { checkConnection, putSavedCredentials } from '~server/lnd';

import { Injectable } from '@nestjs/common';
import { loginDto } from '~shared/commands.dto';

@Injectable()
export class LoginService {
  async post(args: loginDto) {
    const { result, error } = await putSavedCredentials(args);

    const connection = await checkConnection({ node: args.node });

    return { connection, error, result };
  }
}
