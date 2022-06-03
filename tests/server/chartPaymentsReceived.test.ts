import { expect, test } from '@playwright/test';
import spawnCluster from '../utils/spawn_lightning_cluster.js';
import { chartPaymentsReceivedCommand } from '../../main/commands';

try {
  test.describe('Test ChartPaymentsReceived command on the node.js side', async () => {
    let lightning: any[];

    test.beforeAll(async () => {
      lightning = await spawnCluster(2);
    });

    test('run ChartPaymentsReceived command', async () => {
      const args = {
        days: 10,
        nodes: [],
      };

      const lnds = lightning.map(({ lnd }) => lnd);
      const { error, result } = await chartPaymentsReceivedCommand(args, lnds);

      console.log('ChartPaymentsReceived----', result);
      expect(error).toBe(undefined);
      expect(result).toBeTruthy();
    });

    test.afterAll(async () => {
      await Promise.all(lightning.map(({ kill }) => kill({})));
    });
  });
} catch (error) {
  throw error;
}
