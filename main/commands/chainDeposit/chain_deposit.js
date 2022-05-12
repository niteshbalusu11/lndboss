import { auto } from "async";
import { createChainAddress } from "lightning";
import authenticatedLnd from "../../auth/authenticated_lnd";

const bigTok = (tokens) => (!tokens ? "0" : (tokens / 1e8).toFixed(8));
const format = "p2wpkh";

/** Get deposit address

  {
    [tokens]: <Tokens to Receive Number>
  }

  @returns via cbk or Promise
  {
    deposit_address: <Deposit Address URL string>
    deposit_qr: <Deposit Address URL QR Code String>
  }
*/
const chainDepositCommand = async (args) => {
  console.log("Chain Deposit");
  try {
    const result = await auto({
      // Authenticate LND
      lnd: async () => {
        const lnd = await authenticatedLnd();
        return lnd;
      },

      // Get deposit address
      getAddress: [
        "lnd",
        async ({ lnd }) => {
          const { address } = await createChainAddress({
            format,
            lnd,
            is_unused: true,
          });
          return address;
        },
      ],

      url: [
        "getAddress",
        ({ getAddress }) => {
          const address = `bitcoin:${getAddress}?amount=${bigTok(args.tokens)}`;
          return address;
        },
      ],
    });
    console.log(result);
    return { result: result.url };
    return result;
  } catch (error) {
    return { error };
  }
};

export default chainDepositCommand;
