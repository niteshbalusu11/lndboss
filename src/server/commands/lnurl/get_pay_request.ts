import { auto } from 'async';
import { parsePaymentRequest } from 'ln-service';

const errorStatus = 'ERROR';

/** Get a payment request for a LNURL

  {
    hash: <Hash Hex String>
    mtokens: <Millitokens For Payment Request String>
    request: <Request Function>
    url: <URL String>
  }

  @returns via cbk or Promise
  {
    destination: <Destination Public Key Hex String>
    request: <BOLT 11 Payment Request String>
  }
*/

type Args = {
  hash: string;
  mtokens: string;
  request: any;
  url: string;
};

type Tasks = {
  validate: undefined;
  getRequest: {
    destination: string;
    request: string;
  };
};
const getPayRequest = async ({ hash, mtokens, request, url }: Args) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!hash) {
        return cbk([400, 'ExpectedDescriptionHashToGetLnurlPayRequest']);
      }

      if (!mtokens) {
        return cbk([400, 'ExpectedMillitokensToGetLnurlPayRequest']);
      }

      if (!request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlPayRequest']);
      }

      if (!url) {
        return cbk([400, 'ExpectedUrlToGetLnurlPayRequest']);
      }

      return cbk();
    },

    // Get the payment request
    getRequest: [
      'validate',
      ({}, cbk: any) => {
        const qs = { amount: mtokens };

        return request({ qs, url, json: true }, (err, r, json) => {
          if (!!err) {
            return cbk([503, 'FailedToGetPaymentRequestFromService', { err }]);
          }

          if (!json) {
            return cbk([503, 'ServiceFailedToReturnPayReqJson']);
          }

          if (json.status === errorStatus) {
            return cbk([503, 'ServiceReturnedError', { err: json.reason }]);
          }

          if (!json.pr) {
            return cbk([503, 'ExpectedPaymentRequestFromService']);
          }

          try {
            parsePaymentRequest({ request: json.pr });
          } catch (err) {
            return cbk([503, 'FailedToParseReturnedPaymentRequest', { err }]);
          }

          const request = parsePaymentRequest({ request: json.pr });

          if (request.description_hash !== hash) {
            return cbk([503, 'ServiceReturnedInvalidPaymentDescriptionHash']);
          }

          if (request.is_expired) {
            return cbk([503, 'ServiceReturnedExpiredPaymentRequest']);
          }

          if (request.mtokens !== mtokens) {
            return cbk([503, 'ServiceReturnedIncorrectInvoiceAmount']);
          }

          return cbk(null, {
            destination: request.destination,
            request: json.pr,
          });
        });
      },
    ],
  });
};

export default getPayRequest;
