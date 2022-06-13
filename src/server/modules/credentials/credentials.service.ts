import { checkConnection, putSavedCredentials } from '~server/lnd';

import { Injectable } from '@nestjs/common';
import { credentialsDto } from '~shared/commands.dto';

@Injectable()
export class CredentialsService {
  async post(args: credentialsDto) {
    const { postBody } = args;
    const { result, error } = await putSavedCredentials(postBody);
    const connection = await checkConnection({ node: postBody.node });
    return { connection, error, result };
  }
}
