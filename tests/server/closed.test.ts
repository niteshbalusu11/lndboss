import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import { closedCommand } from '../../src/server/commands';

test.describe('Test Closed command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run closed command', async () => {
    const args = {
      limit: 1,
    };
    const { result } = await closedCommand(args, lightning.lnd);
    console.log('closed----', result);
    expect(result.closes).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
