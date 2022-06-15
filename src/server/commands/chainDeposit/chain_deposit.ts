import * as types from '../../../shared/types';

import { AuthenticatedLnd, CreateChainAddressResult, createChainAddress } from 'lightning';
import { HttpException, Logger } from '@nestjs/common';

import { auto } from 'async';

const bigTok = (tokens: number) => (!tokens ? '0' : (tokens / 1e8).toFixed(8));
const format = 'p2wpkh';
const stringify = (data: any) => JSON.stringify(data);

type Tasks = {
  validate: undefined;
  getAddress: CreateChainAddressResult;
  url: {
    address: string;
    url: string;
  };
};

/** Get deposit address
  {
    [tokens]: <Tokens to Receive Number>
  }

  @returns via Promise
  {
    url: <Deposit Address URL string>
  }
*/
const chainDepositCommand = async (args: types.commandChainDeposit, lnd: AuthenticatedLnd) => {
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
          return createChainAddress({ format, lnd, is_unused: true }, cbk);
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
    Logger.error(stringify(error));
    throw new HttpException('UnexpectedErrorGettingInformation', 503);
  }
};

export default chainDepositCommand;
