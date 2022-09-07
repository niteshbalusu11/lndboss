import { AuthenticatedLnd, SignMessageResult, signMessage } from 'lightning';
import { ECPairFactory, TinySecp256k1Interface } from 'ecpair';

import { Logger } from 'winston';
import { auto } from 'async';
import { bech32 } from 'bech32';
import signAuthChallenge from './sign_auth_challenge';

const actionKey = 'action';
const { decode } = bech32;
const defaultAction = 'authenticate';
const asLnurl = (n: string) => n.substring(n.startsWith('lightning:') ? 10 : 0);
const bech32CharLimit = 2000;
const challengeKey = 'k1';
const errorStatus = 'ERROR';
const knownActions = ['auth', 'link', 'login', 'register'];
const okStatus = 'OK';
const prefix = 'lnurl';
const tlsProtocol = 'https:';
const lud13AuthPhrase =
  'DO NOT EVER SIGN THIS TEXT WITH YOUR PRIVATE KEYS! IT IS ONLY USED FOR DERIVATION OF LNURL-AUTH HASHING-KEY, DISCLOSING ITS SIGNATURE WILL COMPROMISE YOUR LNURL-AUTH IDENTITY AND MAY LEAD TO LOSS OF FUNDS!';
const wordsAsUtf8 = n => Buffer.from(bech32.fromWords(n)).toString('utf8');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');

/** Authenticate using lnurl

  {
    ask: <Ask Function>
    request: <Request Function>
    lnd: <Authenticated LND API Object>
    lnurl: <Lnurl String>
    logger: <Winston Logger Object>
  }

  @returns via Promise
  {
    is_authenticated: <Is Authenticated Bool>
  }
*/

type Args = {
  lnurl: string;
  lnd: AuthenticatedLnd;
  request: any;
  logger: Logger;
};

type Tasks = {
  ecp: any;
  validate: undefined;
  parse: {
    action: string;
    hostname: string;
    k1: string;
    url: string;
  };
  seed: SignMessageResult;
  sign: {
    public_key: string;
    signature: string;
  };
  send: {
    is_authenticated: boolean;
  };
};
const auth = async (args: Args): Promise<Tasks> => {
  return auto<Tasks>({
    // Import the ECPair library
    ecp: cbk => cbk(null, ECPairFactory(tinysecp)),

    // Check arguments
    validate: (cbk: any) => {
      if (!args.lnurl) {
        return cbk([400, 'ExpectedUrlToAuthenticateToLnurl']);
      }

      try {
        decode(asLnurl(args.lnurl), bech32CharLimit);
      } catch (err) {
        return cbk([400, 'FailedToDecodeLnurlToAuthenticate', { err }]);
      }

      if (decode(asLnurl(args.lnurl), bech32CharLimit).prefix !== prefix) {
        return cbk([400, 'ExpectedLnUrlPrefixToAuthenticate']);
      }

      if (!args.lnd) {
        return cbk([400, 'ExpectedLndToAuthenticateUsingLnurl']);
      }

      if (!args.logger) {
        return cbk([400, 'ExpectedLoggerToAuthenticateUsingLnurl']);
      }

      if (!args.request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlAuthentication']);
      }

      return cbk();
    },

    // Parse the encoded Lnurl
    parse: [
      'validate',
      ({}, cbk: any) => {
        const { words } = decode(asLnurl(args.lnurl), bech32CharLimit);

        const url = wordsAsUtf8(words);

        try {
          // eslint-disable-next-line no-new
          new URL(url);
        } catch (err) {
          return cbk([400, 'ExpectedValidCallbackUrlInDecodedLnurlForAuth']);
        }

        const { hostname, protocol, searchParams } = new URL(url);

        if (protocol !== tlsProtocol) {
          return cbk([501, 'UnsupportedUrlProtocolForLnurlAuthentication']);
        }

        const action = searchParams.get(actionKey);

        if (!!action && !knownActions.includes(action)) {
          return cbk([503, 'UnknownAuthenticationActionForLnurlAuth']);
        }

        const k1 = searchParams.get(challengeKey);

        if (!k1) {
          return cbk([503, 'ExpectedChallengeK1ValueInDecodedLnurlForAuth']);
        }

        return cbk(null, { hostname, k1, url, action: action || defaultAction });
      },
    ],

    // Sign the canonical phrase for LUD-13 signMessage based seed generation
    seed: ['parse', async ({}) => await signMessage({ lnd: args.lnd, message: lud13AuthPhrase })],

    // Derive keys and get signatures
    sign: [
      'ecp',
      'parse',
      'seed',
      ({ ecp, parse, seed }, cbk) => {
        const sign = signAuthChallenge({
          ecp,
          hostname: parse.hostname,
          k1: parse.k1,
          seed: seed.signature,
        });

        return cbk(null, {
          public_key: sign.public_key,
          signature: sign.signature,
        });
      },
    ],

    // Transmit authenticating signature and key to the host
    send: [
      'parse',
      'sign',
      ({ parse, sign }, cbk: any) => {
        args.logger.info({ sending_authentication: sign.public_key });

        return args.request(
          {
            json: true,
            qs: { key: sign.public_key, sig: sign.signature },
            url: parse.url,
          },
          (err, r, json) => {
            if (!!err) {
              return cbk([503, 'FailedToGetLnurlAuthenticationData', { err }]);
            }

            if (!json) {
              return cbk([503, 'ExpectedJsonReturnedInLnurlResponseForAuth']);
            }

            if (json.status === errorStatus) {
              return cbk([503, 'LnurlAuthenticationFail', { err: json.reason }]);
            }

            if (json.status !== okStatus) {
              return cbk([503, 'ExpectedOkStatusInLnurlResponseJsonForAuth']);
            }

            args.logger.info({ is_authenticated: true });

            return cbk(null, { is_authenticated: true });
          }
        );
      },
    ],
  });
};

export default auth;
