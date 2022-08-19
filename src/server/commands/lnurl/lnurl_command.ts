import * as request from 'balanceofsatoshis/commands/simple_request';

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

  @returns via cbk or Promise
*/
const lnurlCommand = async ({ args, lnd, logger }) => {
  return auto({
    // Check arguments
    validate: (cbk: any) => {
      if (!supportedFunctions.includes(args.function)) {
        return cbk([400, 'ExpectedLnurlFunctionToManageLnurl']);
      }

      if (!lnd) {
        return cbk([400, 'ExpectedLndToManageLnurl']);
      }

      if (!args.lnurl) {
        return cbk([400, 'ExpectedUrlStringToManageLnurl']);
      }

      if (!logger) {
        return cbk([400, 'ExpectedLoggerToManageLnurl']);
      }

      return cbk();
    },

    // Authenticate using lnurl
    auth: ['validate', async ({}) => {
      // Exit early if not lnurl auth
      if (args.function !== functionAuth) {
        return;
      }

      return (await auth({
        lnd,
        logger,
        request,
        lnurl: args.lnurl,
      })).send;
    }],

    // Request inbound channel
    channel: ['validate', async ({}) => {
      // Exit early if not lnurl channel
      if (args.function !== functionChannel) {
        return;
      }

      return (await channel({
        lnd,
        logger,
        request,
        lnurl: args.lnurl,
      })).sendConfirmation;
    }],

    // Pay to lnurl
    pay: ['validate', async ({}) => {
      // Exit early if not lnurl pay
      if (args.function !== functionPay) {
        return;
      }

      return await pay({
        lnd,
        logger,
        request,
        avoid: args.avoid,
        lnurl: args.lnurl,
        max_fee: args.max_fee,
        max_paths: args.max_paths,
        out: args.out,
      });
    }],

    // Withdraw from lnurl
    withdraw: ['validate', async ({}) => {
      // Exit early if not lnurl withdraw
      if (args.function !== functionWithdraw) {
        return;
      }

      return await withdraw({
        lnd,
        logger,
        request,
        lnurl: args.lnurl,
      });
    }],
  },
  );
};

export default lnurlCommand;
