import { authenticatedLndGrpc } from "lightning";
import getCredentials from "./get_credentials";

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
    return error;
  }
};
export default authenticatedLnd;
