import { getWalletInfo } from "lightning";
import authenticatedLnd from "./authenticated_lnd";

const checkConnection = async () => {
  try {
    const lnd = await authenticatedLnd();

    const walletInfo = await getWalletInfo({ lnd });

    return { publicKey: walletInfo.public_key };
  } catch (error) {
    return error;
  }
};

export default checkConnection;
