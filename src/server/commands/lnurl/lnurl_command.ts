import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '~shared/types';

import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import auth from './auth';
import { auto } from 'async';
import channel from './channel';
import pay from './pay';
import withdraw from './withdraw';

const functionAuth = 'auth';
const functionChannel = 'channel';
const functionPay = 'pay';
const functionWithdraw = 'withdraw';
const supportedFunctions = ['auth', 'channel', 'pay', 'withdraw'];

/** Manage Lnurl functions

  {
    [amount]: <Amount to Pay or Withdraw Tokens Number>
    avoid: [<Avoid Forwarding Through String>]
    function: <Lnurl Function String>
    request: <Request Function>
    lnd: <Authenticated LND API Object>
    lnurl: <Lnurl String>
    logger: <Winston Logger Object>
    [max_fee]: <Max Fee Tokens Number>
    [max_paths]: <Maximum Paths Number>
    out: [<Out Through Peer With Public Key Hex String>]
  }

  @returns via Promise
*/
type Args = {
  args: types.commandLnurl;
  lnd: AuthenticatedLnd;
  logger: Logger;
};
const lnurlCommand = async ({ args, lnd, logger }: Args) => {
  return auto({
    // Check arguments
    validate: (cbk: any) => {
      if (!supportedFunctions.includes(args.function)) {
        return cbk([400, 'ExpectedLnurlFunctionToManageLnurl']);
      }

      if (!lnd) {
        return cbk([400, 'ExpectedLndToManageLnurl']);
      }

      if (!args.url) {
        return cbk([400, 'ExpectedUrlStringToManageLnurl']);
      }

      if (!logger) {
        return cbk([400, 'ExpectedLoggerToManageLnurl']);
      }

      return cbk();
    },

    // Authenticate using lnurl
    auth: [
      'validate',
      async ({}) => {
        // Exit early if not lnurl auth
        if (args.function !== functionAuth) {
          return;
        }

        return (
          await auth({
            lnd,
            logger,
            request,
            lnurl: args.url,
          })
        ).send;
      },
    ],

    // Request inbound channel
    channel: [
      'validate',
      async ({}) => {
        // Exit early if not lnurl channel
        if (args.function !== functionChannel) {
          return;
        }

        return (
          await channel({
            lnd,
            logger,
            request,
            is_private: args.is_private,
            lnurl: args.url,
          })
        ).sendConfirmation;
      },
    ],

    // Pay to lnurl
    pay: [
      'validate',
      async ({}) => {
        // Exit early if not lnurl pay
        if (args.function !== functionPay) {
          return;
        }

        return (
          await pay({
            lnd,
            logger,
            request,
            amount: args.amount,
            avoid: args.avoid,
            lnurl: args.url,
            max_fee: args.max_fee || 1337,
            max_paths: args.max_paths || 1,
            out: args.out,
          })
        ).pay;
      },
    ],

    // Withdraw from lnurl
    withdraw: [
      'validate',
      async ({}) => {
        // Exit early if not lnurl withdraw
        if (args.function !== functionWithdraw) {
          return;
        }

        return (
          await withdraw({
            lnd,
            logger,
            request,
            amount: args.amount,
            lnurl: args.url,
          })
        ).withdraw;
      },
    ],
  });
};

export default lnurlCommand;
