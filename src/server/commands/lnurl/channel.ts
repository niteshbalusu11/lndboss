import { AuthenticatedLnd, GetIdentityResult, GetPeersResult, addPeer, getIdentity, getPeers } from 'lightning';

import { Logger } from 'winston';
import { auto } from 'async';
import { bech32 } from 'bech32';
import { getNodeAlias } from 'ln-sync';

const asLnurl = n => n.substring(n.startsWith('lightning:') ? 10 : 0);
const bech32CharLimit = 2000;
const { decode } = bech32;
const errorStatus = 'ERROR';
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const okStatus = 'OK';
const parseUri = n => n.split('@');
const prefix = 'lnurl';
const sslProtocol = 'https:';
const tag = 'channelRequest';
const wordsAsUtf8 = n => Buffer.from(bech32.fromWords(n)).toString('utf8');

/** Request inbound channel from lnurl

  {
    ask: <Ask Function>
    lnd: <Authenticated LND API Object>
    lnurl: <Lnurl String>
    logger: <Winston Logger Object>
    request: <Request Function>
  }

  @returns via Promise
  {
    requested_channel_open: <Requested Channel Open Bool>
  }
*/

type Args = {
  lnurl: string;
  lnd: AuthenticatedLnd;
  request: any;
  logger: Logger;
  is_private: boolean;
};

type Tasks = {
  validate: undefined;
  getIdentity: GetIdentityResult;
  getPeers: GetPeersResult;
  getTerms: {
    id: string;
    socket: string;
    k1: string;
    url: string;
  };
  getAlias: {
    alias: string;
  };
  connect: undefined;
  sendConfirmation: {
    requested_channel_open: boolean;
  };
};
const channel = async (args: Args): Promise<any> => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!args.lnurl) {
        return cbk([400, 'ExpectedUrlToRequestChannelFromLnurl']);
      }

      try {
        decode(asLnurl(args.lnurl), bech32CharLimit);
      } catch (err) {
        return cbk([400, 'FailedToDecodeLnurlToRequestChannel', { err }]);
      }

      if (decode(asLnurl(args.lnurl), bech32CharLimit).prefix !== prefix) {
        return cbk([400, 'ExpectedLnUrlPrefixToRequestChannel']);
      }

      if (!args.lnd) {
        return cbk([400, 'ExpectedLndToRequestChannelFromLnurl']);
      }

      if (!args.logger) {
        return cbk([400, 'ExpectedLoggerToRequestChannelFromLnurl']);
      }

      if (!args.request) {
        return cbk([400, 'ExpectedRequestFunctionToGetLnurlRequestChannel']);
      }

      return cbk();
    },

    // Get node identity public key
    getIdentity: ['validate', async ({}) => await getIdentity({ lnd: args.lnd })],

    // Get the list of connected peers to determine if connection is needed
    getPeers: ['validate', async ({}) => await getPeers({ lnd: args.lnd })],

    // Get accepted terms from the encoded url
    getTerms: [
      'validate',
      ({}, cbk: any) => {
        const { words } = decode(asLnurl(args.lnurl), bech32CharLimit);

        const url = wordsAsUtf8(words);

        return args.request({ url, json: true }, (err, r, json) => {
          if (!!err) {
            return cbk([503, 'FailureGettingLnurlDataFromUrl', { err }]);
          }

          if (!json) {
            return cbk([503, 'ExpectedJsonObjectReturnedInLnurlResponse']);
          }

          if (json.status === errorStatus) {
            return cbk([503, 'UnexpectedServiceError', { err: json.reason }]);
          }

          if (!json.callback) {
            return cbk([503, 'ExpectedCallbackInLnurlResponseJson']);
          }

          try {
            // eslint-disable-next-line no-new
            new URL(json.callback);
          } catch (err) {
            return cbk([503, 'ExpectedValidLnurlResponseCallbackUrl', { err }]);
          }

          if (new URL(json.callback).protocol !== sslProtocol) {
            return cbk([400, 'LnurlsThatSpecifyNonSslUrlsAreUnsupported']);
          }

          if (!json.k1) {
            return cbk([503, 'ExpectedK1InLnurlChannelResponseJson']);
          }

          if (!json.tag) {
            return cbk([503, 'ExpectedTagInLnurlChannelResponseJson']);
          }

          if (json.tag !== tag) {
            return cbk([503, 'ExpectedTagToBeChannelRequestInLnurlResponse']);
          }

          if (!json.uri) {
            return cbk([503, 'ExpectedUriInLnurlResponseJson']);
          }

          // uri: remote node address of form node_key@ip_address:port_number
          const [id, socket] = parseUri(json.uri);

          if (!isPublicKey(id)) {
            return cbk([503, 'ExpectedValidPublicKeyIdInLnurlResponseJson']);
          }

          if (!socket) {
            return cbk([503, 'ExpectedNetworkSocketAddressInLnurlResponse']);
          }

          return cbk(null, { id, socket, k1: json.k1, url: json.callback });
        });
      },
    ],

    // Get the node alias
    getAlias: ['getTerms', async ({ getTerms }) => await getNodeAlias({ id: getTerms.id, lnd: args.lnd })],

    // Connect to the peer returned in the lnurl response
    connect: [
      'getAlias',
      'getPeers',
      'getTerms',
      async ({ getAlias, getPeers, getTerms }) => {
        // Exit early when the node is already connected
        if (getPeers.peers.map(n => n.public_key).includes(getTerms.id)) {
          return;
        }

        args.logger.info({
          connecting_to: {
            alias: getAlias.alias || undefined,
            public_key: getTerms.id,
            socket: getTerms.socket,
          },
        });

        return await addPeer({
          lnd: args.lnd,
          public_key: getTerms.id,
          socket: getTerms.socket,
        });
      },
    ],

    // Make the request to confirm a request for an inbound channel
    sendConfirmation: [
      'getIdentity',
      'getTerms',
      ({ getIdentity, getTerms }, cbk: any) => {
        const type = args.is_private === true ? '1' : '0';

        return args.request(
          {
            json: true,
            qs: {
              k1: getTerms.k1,
              private: type,
              remoteid: getIdentity.public_key,
            },
            url: getTerms.url,
          },
          (err, r, json) => {
            if (!!err) {
              return cbk([503, 'UnexpectedErrorRequestingLnurlChannel', { err }]);
            }

            if (!json) {
              return cbk([503, 'ExpectedJsonObjectReturnedInChannelResponse']);
            }

            if (json.status === errorStatus) {
              return cbk([503, 'ChannelRequestReturnedErr', { err: json.reason }]);
            }

            if (json.status !== okStatus) {
              return cbk([503, 'ExpectedOkStatusInChannelRequestResponse']);
            }

            args.logger.info({ requested_channel_open: true });

            return cbk(null, { requested_channel_open: true });
          }
        );
      },
    ],
  });
};

export default channel;
