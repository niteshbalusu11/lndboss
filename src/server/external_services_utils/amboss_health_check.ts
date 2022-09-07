import { SignMessageResult, signMessage } from 'lightning';
import { auto, each, forever, retry } from 'async';

import { ambossUrl } from '~server/utils/constants';
import axios from 'axios';
import { checkAmbossHealthSetting } from '~server/settings';
import { getSavedNodes } from '~server/lnd';

const postDelayMs = 1000 * 60 * 2;
const retryInterval = 1000 * 60 * 5;
const retryTimes = 10 * 10;

/** Post health check to Amboss
  {
    logger: <NestJsLoggerObject>,
  }
 */

type Tasks = {
  validate: undefined;
  getSavedNodes: {
    nodes: any[];
  };
  postToAmboss: null;
};

const ambossHealthCheck = async ({ logger }): Promise<{ postToAmboss: any }> => {
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
            return cbk([500, 'UnexpectedErrorGettingSavedNodesToPostAmbossHealthCheck', err]);
          }

          return cbk(null, res);
        });
      },
    ],

    // Post to Amboss
    postToAmboss: [
      'getSavedNodes',
      ({ getSavedNodes }, cbk: any) => {
        const { nodes } = getSavedNodes;

        if (!nodes || !nodes.length) {
          return cbk([400, 'ExpectedOnlineNodesToPostAmbossHealthCheck']);
        }

        return forever(
          function () {
            const postToAmboss = () => {
              const date = new Date().toISOString();
              each(nodes, async node => {
                try {
                  const isHealthCheckEnabled =
                    (await checkAmbossHealthSetting()) || process.env.AMBOSS_HEALTH_CHECK === 'true';

                  if (!isHealthCheckEnabled) {
                    return;
                  }

                  const result: SignMessageResult = await signMessage({ lnd: node.lnd, message: date });

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

                  await axios.post(ambossUrl, postBody, config);
                } catch (error) {
                  logger.log({ message: JSON.stringify(error), type: 'error' });
                }
              });
            };

            setInterval(postToAmboss, postDelayMs);
            return cbk();
          },
          function (err) {
            return cbk([500, 'UnexpectedErrorPostingHealthCheckToAmboss', err]);
          }
        );
      },
    ],
  });
};

export default ambossHealthCheck;
