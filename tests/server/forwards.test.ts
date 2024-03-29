import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

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
      tags: [],
      to: 'bob',
    };
    const { result } = await forwardsCommand({ args, lnd: lightning.lnd });
    console.log('forwards----', result);
    expect(result.peers).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
