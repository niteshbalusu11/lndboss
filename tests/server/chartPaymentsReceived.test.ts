import { expect, test } from '@playwright/test';

import { chartPaymentsReceivedCommand } from '../../src/server/commands/';
import spawnCluster from '../utils/spawn_lightning_cluster';

test.describe('Test ChartPaymentsReceived command on the node.js side', async () => {
  let lightning: any[];

  test.beforeAll(async () => {
    lightning = await spawnCluster(2);
  });

  test('run ChartPaymentsReceived command', async () => {
    const args = {
      days: 0,
      nodes: [],
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartPaymentsReceivedCommand({ args, lnd: lnds });

    console.log('ChartPaymentsReceived----', result);

    expect(result).toBeTruthy();
  });

  test('run ChartPaymentsReceived command: dates', async () => {
    const args = {
      is_count: true,
      days: 0,
      end_date: '2021-08-01',
      for: '',
      nodes: [],
      start_date: '2021-07-01',
    };

    const lnds = lightning.map(({ lnd }) => lnd);
    const { result } = await chartPaymentsReceivedCommand({ args, lnd: lnds });

    console.log('ChartPaymentsReceived----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await Promise.all(lightning.map(({ kill }) => kill({})));
  });
});
