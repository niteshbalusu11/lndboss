import { expect, test } from '@playwright/test';

import { chartFeesEarnedCommand } from '../../src/server/commands/';
import { readFile } from 'fs';
import spawnCluster from '../utils/spawn_lightning_cluster';

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
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartFeesEarnedCommand({ args, lnd: lnds });

    console.log('ChartFeesEarned----', result);
    expect(result).toBeTruthy();
  });

  test('run ChartFeesEarned command: dates', async () => {
    const args = {
      days: 0,
      end_date: '2021-08-01',
      nodes: [],
      fs: { getFile: readFile },
      is_count: false,
      is_forwarded: false,
      start_date: '2021-07-01',
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartFeesEarnedCommand({ args, lnd: lnds });

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
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartFeesEarnedCommand({ args, lnd: lnds });

    console.log('ChartFeesEarned----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await Promise.all(lightning.map(({ kill }) => kill({})));
  });
});
