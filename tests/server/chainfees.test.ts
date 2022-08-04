import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import { chainfeesCommand } from '../../src/server/commands/';

test.describe('Test Chainfees command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run Chainfees command', async () => {
    const args = {
      blocks: 6,
    };
    const { result } = await chainfeesCommand({ args, lnd: lightning.lnd });
    console.log('chain fees----', result);
    expect(result.current_block_hash).toBeTruthy();
    expect(result.fee_by_block_target).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
