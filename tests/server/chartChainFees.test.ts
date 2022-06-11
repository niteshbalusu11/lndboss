import { expect, test } from '@playwright/test';

import { chartChainFeesCommand } from '../../src/server/commands/';
import spawnCluster from '../utils/spawn_lightning_cluster.js';

test.describe('Test ChartChainFees command on the node.js side', async () => {
  let lightning: any[];

  test.beforeAll(async () => {
    lightning = await spawnCluster(2);
  });

  test('run ChartChainFees command', async () => {
    const args = {
      days: 10,
      nodes: [],
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { error, result } = await chartChainFeesCommand(args, lnds);

    console.log('Chart Chain Fees----', result);
    expect(error).toBe(undefined);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await Promise.all(lightning.map(({ kill }) => kill({})));
  });
});
