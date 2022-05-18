import { auto } from 'async';
import { AuthenticatedLnd, createChainAddress } from 'lightning';
import authenticatedLnd from '../../auth/authenticated_lnd';

const bigTok = tokens => (!tokens ? '0' : (tokens / 1e8).toFixed(8));
const format = 'p2wpkh';
const stringify = (data: any) => JSON.stringify(data);

type Tasks = {
  lnd: AuthenticatedLnd;
  getAddress: string;
  url: {
    address: string;
    url: string;
  };
};

/** Get deposit address
  {
    [tokens]: <Tokens to Receive Number>
  }

  @returns via cbk or Promise
  {
    url: <Deposit Address URL string>
  }
*/
const chainDepositCommand = async args => {
  try {
    const result = await auto<Tasks>({
      // Authenticate LND
      lnd: [
        async () => {
          const lnd: AuthenticatedLnd = await authenticatedLnd();
          return lnd;
        },
      ],
      // Get deposit address
      getAddress: [
        'lnd',
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
        'getAddress',
        async ({ getAddress }) => {
          const url = `bitcoin:${getAddress}?amount=${bigTok(args.amount)}`;
          const address = `Deposit Address: ${getAddress}`;

          return { address, url };
        },
      ],
    });

    return { result: result.url };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default chainDepositCommand;
