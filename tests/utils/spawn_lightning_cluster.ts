import { spawnLightningCluster } from 'ln-docker-daemons';

const spawnCluster = async (size: number) => {
  const { nodes } = await spawnLightningCluster({ size });

  console.log('============================Lightning Cluster Spawned===============================');

  return nodes;
};

export default spawnCluster;
