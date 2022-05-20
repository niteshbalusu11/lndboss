import { verifyAccess } from 'lightning';
import authenticatedLnd from './authenticated_lnd';
import getCredentials from './get_credentials';
const stringify = (data: any) => JSON.stringify(data);

/** Check if lnd is connected

  @returns via Promise
  {
    result: <Public Key String>
    error: <Error String>
  }
*/

const checkConnection = async (): Promise<{ [key: string]: string | boolean }> => {
  try {
    const lnd = await authenticatedLnd();
    const permissions = ['info:read'];
    const { macaroon } = await getCredentials();

    const hasAccess = (await verifyAccess({ lnd, macaroon, permissions })).is_valid;

    return { hasAccess };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default checkConnection;
