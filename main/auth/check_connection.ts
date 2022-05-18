import { getWalletInfo } from "lightning";
import authenticatedLnd from "./authenticated_lnd";

const checkConnection = async (): Promise<string> => {
  try {
    const lnd = await authenticatedLnd();

    const walletInfo = await getWalletInfo({ lnd });

    const publicKey = walletInfo.public_key;

    return publicKey;
  } catch (error) {
    return error;
  }
};

export default checkConnection;
