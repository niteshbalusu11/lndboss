import { AuthenticatedLnd, getIdentity } from 'lightning';
import { spawnLightningCluster } from 'ln-docker-daemons';

export type SpawnLightningServerType = {
  lnd: AuthenticatedLnd;
  kill: ({}) => Promise<void>;
};

const spawnLightningServer = async (): Promise<SpawnLightningServerType> => {
  try {
    // Launch a lightning node
    const { nodes } = await spawnLightningCluster({});
    const [{ lnd, generate, kill }] = nodes;

    const publicKey = (await getIdentity({ lnd })).public_key;

    if (!!publicKey) {
      console.log('============================Lightning Server Spawned===============================');
    }

    // Generate some coins for the wallet
    await generate({ count: 500 });

    // Stop the image
    return { lnd, kill };
  } catch (error) {
    throw error;
  }
};

export default spawnLightningServer;
