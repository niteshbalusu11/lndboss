import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { reconnectCommand } from '../../src/server/commands/';

test.describe('Test Reconnect command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run Reconnect command', async () => {
    const { result } = await reconnectCommand({ lnd: lightning.lnd });

    console.log('reconnect----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
