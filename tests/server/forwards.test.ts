import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import { forwardsCommand } from '../../src/server/commands';

test.describe('Test Forwards command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run forwards command', async () => {
    const args = {
      days: 4,
      from: 'alice',
      sort: 'earned_in',
      to: 'bob',
    };
    const { result } = await forwardsCommand(args, lightning.lnd);
    console.log('forwards----', result);
    expect(result.peers).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
