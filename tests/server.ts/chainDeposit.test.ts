import { expect, test } from '@playwright/test';
import spawnLightningServer from '../utils/spawn_lightning_server.js';
import { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';
import chainDepositCommand from '../../main/commands/chainDeposit/chain_deposit';

try {
  test.describe('Test authentication from server side', async () => {
    let lightning: SpawnLightningServerType;

    test.beforeAll(async () => {
      lightning = await spawnLightningServer();
    });

    test('run balance command', async () => {
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
