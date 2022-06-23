import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import { findCommand } from '../../src/server/commands/';

test.describe('Test Find command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run Find command', async () => {
    const args = {
      query: 'alice',
    };
    const { result } = await findCommand(args, lightning.lnd);
    console.log('find----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
