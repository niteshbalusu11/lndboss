import { getWalletInfo } from 'lightning';
import authenticatedLnd from './authenticated_lnd';
const stringify = (data: any) => JSON.stringify(data);

const checkConnection = async (): Promise<{ [key: string]: string }> => {
  try {
    const lnd = await authenticatedLnd();

    const walletInfo = await getWalletInfo({ lnd });

    return { publicKey: walletInfo.public_key };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default checkConnection;
