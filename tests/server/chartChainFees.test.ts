import { expect, test } from '@playwright/test';

import { chartChainFeesCommand } from '../../src/server/commands/';
import spawnCluster from '../utils/spawn_lightning_cluster';

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
    const { result } = await chartChainFeesCommand({ args, lnd: lnds });

    console.log('Chart Chain Fees----', result);
    expect(result).toBeTruthy();
  });

  test('run ChartChainFees command: dates', async () => {
    const args = {
      days: 0,
      end_date: '2021-08-01',
      nodes: [],
      start_date: '2021-07-01',
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartChainFeesCommand({ args, lnd: lnds });

    console.log('Chart Chain Fees----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await Promise.all(lightning.map(({ kill }) => kill({})));
  });
});
