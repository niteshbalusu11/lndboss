import { spawnLightningCluster } from 'ln-docker-daemons';

const spawnCluster = async (size: number) => {
  try {
    // Launch a lightning cluster
    const { nodes } = await spawnLightningCluster({ size });

    console.log('============================Lightning Cluster Spawned===============================');

    return nodes;
  } catch (error) {
    throw error;
  }
};

export default spawnCluster;
