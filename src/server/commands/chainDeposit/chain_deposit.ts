import * as types from '~shared/types';

import { AuthenticatedLnd, CreateChainAddressResult, createChainAddress } from 'lightning';

import { auto } from 'async';
import { httpLogger } from '~server/utils/global_functions';

const bigTok = (tokens: number) => (!tokens ? '0' : (tokens / 1e8).toFixed(8));

/** Get deposit address
  {
    [format]: <Address format String>
    [tokens]: <Tokens to Receive Number>
  }

  @returns via Promise
  {
    url: <Deposit Address URL string>
  }
*/

type Tasks = {
  validate: undefined;
  getAddress: CreateChainAddressResult;
  url: {
    address: string;
    url: string;
  };
};

type Return = {
  address: string;
  url: string;
};

const chainDepositCommand = async (
  args: types.commandChainDeposit,
  lnd: AuthenticatedLnd
): Promise<{ result: Return }> => {
  try {
    const result = await auto<Tasks>({
      // Validate
      validate: (cbk: any) => {
        if (!lnd) {
          return cbk([400, 'ExpectedAuthenticatedLndToCreateChainDepositAddress']);
        }

        return cbk();
      },
      // Get deposit address
      getAddress: [
        'validate',
        ({}, cbk: any) => {
          return createChainAddress({ format: args.format, lnd, is_unused: true }, cbk);
        },
      ],

      url: [
        'getAddress',
        async ({ getAddress }) => {
          const url = `bitcoin:${getAddress.address}?amount=${bigTok(args.amount)}`;
          const address = `Deposit Address: ${getAddress.address}`;

          return { address, url };
        },
      ],
    });

    return { result: result.url };
  } catch (error) {
    httpLogger({ error });
  }
};

export default chainDepositCommand;
