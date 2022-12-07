import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { utxosCommand } from '../../src/server/commands';

test.describe('Test Utxos command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run forwards command', async () => {
    const args = {
      count_below: 0,
      is_confirmed: false,
      is_count: false,
      min_tokens: 0,
    };

    const { result } = await utxosCommand({ args, lnd: lightning.lnd });
    console.log('utxos----', result);
    expect(result.utxos).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
