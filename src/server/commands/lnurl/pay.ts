import { AuthenticatedLnd } from 'lightning';
import { Logger } from 'winston';
import { auto } from 'async';
import { getNodeAlias } from 'ln-sync';
import getPayRequest from './get_pay_request';
import getPayTerms from './get_pay_terms';
import parseUrl from './parse_url';
import { pay as payInvoice } from 'balanceofsatoshis/network';
import { readFile } from 'fs';

const tokensAsMtokens = (tokens: number): string => Math.floor(tokens * 1e3).toString();

/** Pay to lnurl

  {
    ask: <Ask Function>
    avoid: [<Avoid Forwarding Through String>]
    lnd: <Authenticated LND API Object>
    lnurl: <Lnurl String>
    logger: <Winston Logger Object>
    max_fee: <Max Fee Tokens Number>
    max_paths: <Maximum Paths Number>
    out: [<Out Through Peer With Public Key Hex String>]
    request: <Request Function>
  }

  @returns via Promise
*/

type Args = {
  amount: number;
  avoid: string[];
  lnd: AuthenticatedLnd;
  lnurl: string;
  logger: Logger;
  max_fee: number;
  max_paths: number;
  out: string[];
  request: any;
};

type Tasks = {
  validate: undefined;
  getTerms: {
    description: string;
    hash: string;
    max: number;
    min: number;
    url: string;
  };
  validateTerms: undefined;
  getRequest: { destination: string; request: string };
  getAlias: { alias: string };
  pay: any;
};
const pay = async (args: Args): Promise<Tasks> => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!args.lnurl) {
        return cbk([400, 'ExpectedUrlToGetPaymentRequestFromLnurl']);
      }

      try {
        parseUrl({ url: args.lnurl });
      } catch (err) {
        return cbk([400, err.message]);
      }

      if (!args.lnd) {
        return cbk([400, 'ExpectedLndToGetPaymentRequestFromLnurl']);
      }

      if (!args.logger) {
        return cbk([400, 'ExpectedLoggerToGetPaymentRequestFromLnurl']);
      }

      if (!args.max_fee) {
        return cbk([400, 'ExpectedMaxFeeToGetPaymentRequestFromLnurl']);
      }

      if (!args.max_paths) {
        return cbk([400, 'ExpectedMaxPathsCountToPayViaLnurl']);
      }

      if (!args.request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlData']);
      }

      if (!args.amount) {
        return cbk([400, 'ExpectedAmountToPayViaLnurl']);
      }

      return cbk();
    },

    // Get accepted terms from the encoded url
    getTerms: [
      'validate',
      async ({}) => {
        return (
          await getPayTerms({
            request: args.request,
            url: parseUrl({ url: args.lnurl }).url,
          })
        ).getTerms;
      },
    ],

    // Validate terms
    validateTerms: [
      'getTerms',
      ({ getTerms }, cbk: any) => {
        if (getTerms.min > args.amount) {
          return cbk([400, 'AmountBelowMinimumAcceptedAmountToPayViaLnurl', getTerms.min]);
        }

        if (getTerms.max < args.amount) {
          return cbk([400, 'AmountAboveMaximumAcceptedAmountToPayViaLnurl', getTerms.max]);
        }

        return cbk();
      },
    ],

    // Get payment request
    getRequest: [
      'getTerms',
      'validateTerms',
      async ({ getTerms }) => {
        return (
          await getPayRequest({
            hash: getTerms.hash,
            mtokens: tokensAsMtokens(args.amount),
            request: args.request,
            url: getTerms.url,
          })
        ).getRequest;
      },
    ],

    // Get the destination node alias
    getAlias: [
      'getRequest',
      async ({ getRequest }) => {
        return await getNodeAlias({ id: getRequest.destination, lnd: args.lnd });
      },
    ],

    // Pay the payment request
    pay: [
      'getAlias',
      'getRequest',
      async ({ getAlias, getRequest }) => {
        args.logger.info({ paying: getAlias.alias });

        const avoidArray = !!args.avoid ? args.avoid.filter(n => !!n) : [];
        const outArray = !!args.out ? args.out.filter(n => !!n) : [];

        return await payInvoice({
          avoid: avoidArray,
          fs: { getFile: readFile },
          lnd: args.lnd,
          logger: args.logger,
          max_fee: args.max_fee,
          max_paths: args.max_paths,
          out: outArray,
          request: getRequest.request,
        });
      },
    ],
  });
};

export default pay;
