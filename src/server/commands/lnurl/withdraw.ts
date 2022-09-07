import { AuthenticatedLnd, CreateInvoiceResult, createInvoice } from 'lightning';

import { Logger } from 'winston';
import { auto } from 'async';
import { bech32 } from 'bech32';

const { decode } = bech32;
const asLnurl = n => n.substring(n.startsWith('lightning:') ? 10 : 0);
const bech32CharLimit = 2000;
const errorStatus = 'ERROR';
const isNumber = n => !isNaN(n);
const minWithdrawable = 1;
const mtokensAsTokens = n => Math.floor(n / 1000);
const prefix = 'lnurl';
const sslProtocol = 'https:';
const tag = 'withdrawRequest';
const tokensAsMillitokens = n => n * 1000;
const wordsAsUtf8 = n => Buffer.from(bech32.fromWords(n)).toString('utf8');

/** Withdraw from lnurl

  {
    ask: <Ask Function>
    request: <Request Function>
    lnd: <Authenticated LND API Object>
    lnurl: <Lnurl String>
    logger: <Winston Logger Object>
  }

  @returns via cbk or Promise
*/

type Args = {
  lnurl: string;
  lnd: AuthenticatedLnd;
  request: any;
  logger: Logger;
  amount: number;
};

type Tasks = {
  validate: undefined;
  getTerms: {
    description: string;
    max: number;
    min: number;
    url: string;
    k1: string;
  };
  validateTerms: undefined;
  createInvoice: CreateInvoiceResult;
  withdraw: { withdrawal_request_sent: boolean };
};
const withdraw = async (args: Args): Promise<Tasks> => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!args.lnurl) {
        return cbk([400, 'ExpectedUrlToWithdrawFromLnurl']);
      }

      try {
        decode(asLnurl(args.lnurl), bech32CharLimit);
      } catch (err) {
        return cbk([400, 'FailedToDecodeLnurlToWithdraw', { err }]);
      }

      if (decode(asLnurl(args.lnurl), bech32CharLimit).prefix !== prefix) {
        return cbk([400, 'ExpectedLnUrlPrefixToWithdraw']);
      }

      if (!args.lnd) {
        return cbk([400, 'ExpectedLndToWithdrawFromLnurl']);
      }

      if (!args.logger) {
        return cbk([400, 'ExpectedLoggerToWithdrawFromLnurl']);
      }

      if (!args.request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlWithdrawData']);
      }

      return cbk();
    },

    // Get accepted terms from the encoded url
    getTerms: [
      'validate',
      ({}, cbk: any) => {
        const { words } = decode(asLnurl(args.lnurl), bech32CharLimit);

        const url = wordsAsUtf8(words);

        return args.request({ url, json: true }, (err, r, json) => {
          if (!!err) {
            return cbk([503, 'FailureGettingLnUrlDataFromUrl', { err }]);
          }

          if (!json) {
            return cbk([503, 'ExpectedJsonObjectReturnedInLnurlResponse']);
          }

          if (json.status === errorStatus) {
            return cbk([503, 'LnurlWithdrawReturnedErr', { err: json.reason }]);
          }

          if (!json.callback) {
            return cbk([503, 'ExpectedCallbackInLnurlResponseJson']);
          }

          try {
            // eslint-disable-next-line no-new
            new URL(json.callback);
          } catch (err) {
            return cbk([503, 'ExpectedValidCallbackUrlInLnurlResponseJson']);
          }

          if (new URL(json.callback).protocol !== sslProtocol) {
            return cbk([400, 'LnurlsThatSpecifyNonSslUrlsAreUnsupported']);
          }

          if (!json.k1) {
            return cbk([503, 'ExpectedK1InLnurlResponseJson']);
          }

          if (!json.tag) {
            return cbk([503, 'ExpectedTagInLnurlResponseJson']);
          }

          if (json.tag !== tag) {
            return cbk([503, 'ExpectedTagToBeWithdrawRequestInLnurlResponse']);
          }

          if (!isNumber(json.minWithdrawable)) {
            return cbk([503, 'ExpectedNumericValueForMinWithdrawable']);
          }

          if (!isNumber(json.maxWithdrawable)) {
            return cbk([503, 'ExpectedNumericValueForMaxWithdrawable']);
          }

          if (json.minWithdrawable < minWithdrawable) {
            return cbk([400, 'MinWithdrawableIsLowerThanSupportedValue']);
          }

          if (json.minWithdrawable > json.maxWithdrawable) {
            return cbk([400, 'MinWithdrawableIsHigherThanMaxWithdrawable']);
          }

          return cbk(null, {
            description: json.defaultDescription,
            k1: json.k1,
            max: mtokensAsTokens(json.maxWithdrawable),
            min: mtokensAsTokens(json.minWithdrawable),
            url: json.callback,
          });
        });
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

    // Create a new payment request for withdrawl
    createInvoice: [
      'getTerms',
      'validateTerms',
      async ({}) => {
        return await createInvoice({ lnd: args.lnd, mtokens: tokensAsMillitokens(args.amount).toString() });
      },
    ],

    // Send the withdraw request
    withdraw: [
      'createInvoice',
      'getTerms',
      ({ createInvoice, getTerms }, cbk: any) => {
        args.logger.info({ invoice: createInvoice.request });

        const { url } = getTerms;
        const { k1 } = getTerms;

        const qs = { k1, pr: createInvoice.request };

        return args.request({ url, qs, json: true }, (err, r, json) => {
          if (!!err) {
            return cbk([503, 'UnexpectedErrorRequestingLnurlWithdraw', { err }]);
          }

          if (!json) {
            return cbk([503, 'ExpectedJsonObjectReturnedInWithdrawResponse']);
          }

          if (!json.status) {
            return cbk([503, 'ExpectedStatusInLnurlWithdrawResponseJson']);
          }

          if (json.status === errorStatus) {
            return cbk([503, 'LnurlWithdrawReqFailed', { err: json.reason }]);
          }

          if (json.status !== 'OK') {
            return cbk([503, 'ExpectedStatusToBeOkInLnurlResponseJson']);
          }

          args.logger.info({ withdrawal_request_sent: true });

          return cbk(null, { withdrawal_request_sent: true });
        });
      },
    ],
  });
};

export default withdraw;
