import { auto, each, retry } from 'async';

import { ambossUrl } from '~server/utils/constants';
import axios from 'axios';
import { getSavedNodes } from '~server/lnd';
import { signature } from '~server/commands/grpc_utils/grpc_utils';

const retryInterval = 30000;
const retryTimes = 15;

/** Post amboss health checks
  {
    logger: <NestJS Logger Object>,
  }
  @returns via Promise
  {
    postToAmboss: <Boolean>,
  }
 */

type Tasks = {
  validate: undefined;
  getSavedNodes: {
    nodes: any[];
  };
  postToAmboss: boolean | undefined;
};
const ambossHealthCheck = async ({ logger }): Promise<{ postToAmboss: boolean }> => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!logger) {
        return cbk([400, 'ExpectedNestJsLoggerObjectToPostAmbossHealthCheck']);
      }

      return cbk();
    },

    // Get Saved nodes
    getSavedNodes: [
      'validate',
      ({}, cbk: any) => {
        const retryGetSavedNodes = async () => {
          const { nodes } = await getSavedNodes({ network: 'btc' });

          if (!nodes.nodes || !nodes.nodes.length) {
            logger.log({ type: 'warn', message: 'ExpectedAuthenticatedLndToPostAmbossHealthCheck---Retrying...' });
            throw new Error('ExpectedAuthenticatedLndToPostAmbossHealthCheck');
          }

          const filteredNodes = nodes.nodes.filter(node => !!node.lnd && !!node.is_online);

          if (!filteredNodes.length) {
            logger.log({ type: 'warn', message: 'ExpectedOnlineNodesToPostAmbossHealthCheck---Retrying...' });
            throw new Error('ExpectedOnlineNodesToPostAmbossHealthCheck');
          }

          // Log offline nodes
          const offlineNodes = nodes.nodes.filter(node => !node.is_online);

          each(offlineNodes, node => {
            logger.log({ type: 'warn', message: `OfflineNode ${node.node_name}` });
          });

          return { nodes: filteredNodes };
        };

        retry({ times: retryTimes, interval: retryInterval }, retryGetSavedNodes, (err, res) => {
          if (!!err) {
            return cbk([500, 'UnexpectedErrorGettingSavedNodes', err]);
          }

          return cbk(null, res);
        });
      },
    ],

    // Post to amboss
    postToAmboss: [
      'getSavedNodes',
      ({ getSavedNodes }, cbk: any) => {
        if (!getSavedNodes.nodes || !getSavedNodes.nodes.length) {
          return cbk();
        }

        const { nodes } = getSavedNodes;
        const date = new Date().toISOString();

        each(nodes, async node => {
          try {
            const { result } = await signature({ lnd: node.lnd, message: date });
            const config = {
              headers: { contentType: 'application/json' },
            };

            const postBody = {
              query: `mutation HealthCheck($signature: String!, $timestamp: String!) {
                    healthCheck(signature: $signature, timestamp: $timestamp)
                  }`,
              variables: {
                signature: result.signature,
                timestamp: date,
              },
            };

            const axiosResult = await axios.post(ambossUrl, postBody, config);

            logger.log({ message: axiosResult.data, type: 'json' });
          } catch (error) {
            logger.log({ message: error.message, type: 'error' });
          }
        });

        return cbk(null, true);
      },
    ],
  });
};

export default ambossHealthCheck;
