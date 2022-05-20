import { authenticatedLndGrpc } from 'lightning';
import getCredentials from './get_credentials';

/** Get authenticated lnd object

  @returns via cbk or Promise
  {
    lnd: <Authenticated LND Object>
  }
*/

const authenticatedLnd = async () => {
  try {
    const { cert, macaroon, socket } = await getCredentials();

    const { lnd } = authenticatedLndGrpc({
      macaroon,
      cert,
      socket,
    });

    return lnd;
  } catch (error) {
    throw error;
  }
};
export default authenticatedLnd;
