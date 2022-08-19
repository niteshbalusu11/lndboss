import { auto } from 'async';
import getPayRequest from './get_pay_request';
import getPayTerms from './get_pay_terms';
import parseUrl from './parse_url';

const tokensAsMtokens = tokens => (BigInt(tokens) * BigInt(1e3)).toString();

/** Get a LNURL request for a given amount

  {
    lnurl: <LNUrl String>
    request: <Request Function>
    tokens: <Tokens Payment Request String>
  }

  @returns via cbk or Promise
  {
    destination: <Destination Public Key Hex String>
    request: <BOLT 11 Payment Request String>
  }
*/

type Tasks = {
  validate: undefined;
  url: string;
  getTerms: {
    max: number;
    min: number;
    hash: string;
    url: string;
  };
  getRequest: {
    destination: string;
    request: string;
  };
};
const getLnurlRequest = async ({ lnurl, request, tokens }) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      try {
        parseUrl({ url: lnurl });
      } catch (err) {
        return cbk([400, err.message]);
      }

      if (!request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlRequest']);
      }

      if (!tokens) {
        return cbk([400, 'ExpectedTokensToGetLnurlRequest']);
      }

      return cbk();
    },

    // Parse the LNURL into a regular url
    url: ['validate', ({}, cbk) => {
      return cbk(null, parseUrl({ url: lnurl }).url);
    }],

    // Get accepted terms from the encoded url
    getTerms: ['url', async ({ url }) => await getPayTerms({ request, url })],

    // Get payment request
    getRequest: ['getTerms', async ({ getTerms }) => {
      if (tokens > getTerms.max) {
        throw new Error([400, 'PaymentAmountAboveMaximum', { max: getTerms.max }].join('\n'));
      }

      if (tokens < getTerms.min) {
        throw new Error([400, 'PaymentAmountBelowMinimum', { min: getTerms.min }].join('\n'));
      }

      return await getPayRequest({
        request,
        hash: getTerms.hash,
        mtokens: tokensAsMtokens(tokens),
        url: getTerms.url,
      });
    }],
  });
};

export default getLnurlRequest;
