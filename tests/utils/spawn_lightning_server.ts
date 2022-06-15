import { AuthenticatedLnd, getIdentity } from 'lightning';

import { spawnLightningCluster } from 'ln-docker-daemons';

export type SpawnLightningServerType = {
  lnd: AuthenticatedLnd;
  kill: ({}) => Promise<void>;
};

const spawnLightningServer = async (): Promise<SpawnLightningServerType> => {
  // Launch a lightning node
  const { nodes } = await spawnLightningCluster({});
  const [{ lnd, generate, kill }] = nodes;

  await generate({ count: 5 });

  const publicKey = (await getIdentity({ lnd })).public_key;

  if (!!publicKey) {
    console.log('============================Lightning Server Spawned===============================');
  }

  // Stop the image
  return { lnd, kill };
};

export default spawnLightningServer;
