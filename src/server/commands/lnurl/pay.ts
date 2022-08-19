import { auto } from 'async';
import { getNodeAlias } from 'ln-sync';
import getPayRequest from './get_pay_request';
import getPayTerms from './get_pay_terms';
import parseUrl from './parse_url';
import { pay as payInvoice } from 'balanceofsatoshis/network';

const { isArray } = Array;

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

  @returns via cbk or Promise
*/

type Tasks = {
  validate: undefined;
  getTerms: { url: string; hash: string };
  getRequest: { destination: string; request: string };
  getAlias: { alias: string };
  pay: any;
}
const pay = async (args) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!isArray(args.avoid)) {
        return cbk([400, 'ExpectedAvoidArrayToGetPaymentRequestFromLnurl']);
      }

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

      if (!isArray(args.out)) {
        return cbk([400, 'ExpectedArrayOfOutPeersToPayViaLnurl']);
      }

      if (!args.request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlData']);
      }

      return cbk();
    },

    // Get accepted terms from the encoded url
    getTerms: ['validate', async ({}) => {
      return getPayTerms({
        request: args.request,
        url: parseUrl({ url: args.lnurl }).url,
      });
    }],

    // Get payment request
    getRequest: ['getTerms', async ({ getTerms }) => {
      return getPayRequest({
        hash: getTerms.hash,
        mtokens: args.amount,
        request: args.request,
        url: getTerms.url,
      });
    }],

    // Get the destination node alias
    getAlias: ['getRequest', async ({ getRequest }) => {
      return await getNodeAlias({ id: getRequest.destination, lnd: args.lnd });
    }],

    // Pay the payment request
    pay: ['getAlias', 'getRequest', async ({ getAlias, getRequest }) => {
      args.logger.info({ paying: getAlias.alias });

      return await payInvoice({
        avoid: args.avoid,
        lnd: args.lnd,
        logger: args.logger,
        max_fee: args.max_fee,
        max_paths: args.max_paths,
        out: args.out,
        request: getRequest.request,
      });
    }],
  });
};

export default pay;
