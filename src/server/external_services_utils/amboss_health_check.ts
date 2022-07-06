import { ambossUrl } from '~server/utils/constants';
import axios from 'axios';
import { getSavedNodes } from '~server/lnd';
import { signature } from '~server/commands/grpc_utils/grpc_utils';

/** Ping the amboss API to propagate your node online status
 {
    logger: <BosloggerService>,
 }
*/

const ambossHealthCheck = async ({ logger }): Promise<void> => {
  try {
    const { nodes } = await getSavedNodes({ network: 'btc' });

    const date = new Date().toISOString();

    if (!nodes.nodes && !nodes.nodes.length) {
      return;
    }

    const ambossResult = await Promise.all(
      nodes.nodes
        .filter(node => !!node.lnd && !!node.is_online)
        .map(async node => {
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

            return axiosResult.data;
          } catch (error) {
            logger.log({ message: error.message, type: 'error' });
          }
        })
    );

    logger.log({ message: ambossResult, type: 'json' });
  } catch (error) {
    logger.log({ message: error.message, type: 'error' });
  }
};

export default ambossHealthCheck;
