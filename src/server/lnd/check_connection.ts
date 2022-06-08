import authenticatedLnd from './authenticated_lnd';
import getSavedCredentials from './get_saved_credentials';
import { verifyAccess } from 'lightning';

const stringify = (data: any) => JSON.stringify(data);

/** Check if lnd is connected

  @returns via Promise
  {
    result: <Public Key String>
    [error]: <Error String>
  }
*/

type Args = {
  node: string;
};

const checkConnection = async ({ node }: Args): Promise<{ [key: string]: string | boolean }> => {
  try {
    const permissions = ['info:read'];
    const { lnd } = await authenticatedLnd({ node });
    const { macaroon } = await getSavedCredentials({ node });
    const hasAccess = (await verifyAccess({ lnd, macaroon, permissions })).is_valid;

    return { hasAccess };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default checkConnection;
