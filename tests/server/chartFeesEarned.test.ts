import { expect, test } from '@playwright/test';

import { chartFeesEarnedCommand } from '../../src/server/commands/';
import { readFile } from 'fs';
import spawnCluster from '../utils/spawn_lightning_cluster.js';

test.describe('Test ChartFeesEarned command on the node.js side', async () => {
  let lightning: any[];

  test.beforeAll(async () => {
    lightning = await spawnCluster(2);
  });

  test('run ChartFeesEarned command', async () => {
    const args = {
      days: 10,
      nodes: [],
      fs: { getFile: readFile },
      is_count: false,
      is_forwarded: false,
      via: 'outpeers',
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartFeesEarnedCommand(args, lnds);

    console.log('ChartFeesEarned----', result);
    expect(result).toBeTruthy();
  });

  test('run ChartFeesEarned command with is_count and is_forwarded', async () => {
    const args = {
      days: 10,
      nodes: [],
      fs: { getFile: readFile },
      is_count: true,
      is_forwarded: true,
      via: 'outpeers',
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartFeesEarnedCommand(args, lnds);

    console.log('ChartFeesEarned----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await Promise.all(lightning.map(({ kill }) => kill({})));
  });
});
