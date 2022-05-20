import { expect, test } from '@playwright/test';
import spawnLightningServer from '../utils/spawn_lightning_server.js';
import { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';
import balanceCommand from '../../main/commands/balance/balance_command';

try {
  test.describe('Test Balance command on the node.js side', async () => {
    let lightning: SpawnLightningServerType;

    test.beforeAll(async () => {
      lightning = await spawnLightningServer();
    });

    test('run balance command', async () => {
      const args = {
        above: 0,
        below: 0,
        is_confirmed: true,
        is_offchain_only: false,
        is_onchain_only: false,
      };
      const { result, error } = await balanceCommand(args, lightning.lnd);

      console.log('balance----', result);
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
