import { expect, test } from '@playwright/test';
import spawnLightningServer from '../utils/spawn_lightning_server.js';
import { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';
import { chainDepositCommand } from '../../main/commands';

try {
  test.describe('Test ChainDeposit command on the node.js side', async () => {
    let lightning: SpawnLightningServerType;

    test.beforeAll(async () => {
      lightning = await spawnLightningServer();
    });

    test('run ChainDeposit command', async () => {
      const args = {
        amount: 1000,
      };
      const { error, result } = await chainDepositCommand(args, lightning.lnd);
      console.log('chain deposit----', result);
      expect(error).toBe(undefined);
      expect(result).toBeTruthy();
    });

    test.afterAll(async () => {
      await lightning.kill({});
    });
  });
} catch (error) {
  throw error;
}
