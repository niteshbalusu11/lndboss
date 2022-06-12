import { checkConnection, putSavedCredentials } from '~server/lnd';

import { Injectable } from '@nestjs/common';
import { credentialsDto } from '~shared/commands.dto';

@Injectable()
export class CredentialsService {
  async post(args: credentialsDto) {
    const { credentials } = args;
    const { result, error } = await putSavedCredentials(credentials);
    const connection = await checkConnection({ node: credentials.node });
    return { connection, error, result };
  }
}
