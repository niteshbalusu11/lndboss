import { checkConnection, putSavedCredentials } from '~server/lnd';

import { Injectable } from '@nestjs/common';
import { credentialsDto } from '~shared/commands.dto';

/**  Credentials Service: Handles routes to the credentials service
  {
    cert: <Cert String>
    is_default: <Boolean>
    macaroon: <Macaroon String>
    node: <Node String>
    socket: <Socket String>
  }
  @returns via Promise
  {
    connection: <Connection Success Boolean>
    error: <Error String>
    result: <Success writing credentials Boolean>
*/

@Injectable()
export class CredentialsService {
  async post(args: credentialsDto) {
    const { result } = await putSavedCredentials(args);
    const connection = await checkConnection({ node: args.node });
    return { connection, result };
  }
}
