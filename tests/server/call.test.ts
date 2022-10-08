import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { callCommand } from '../../src/server/commands/';

test.describe('Test Call command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run call command', async () => {
    const args = {
      method: 'createInvoice',
      postArgs: {
        cltv_delta: 144,
        description: 'testdescription',
        is_including_private_channels: true,
        mtokens: '1000',
      },
    };
    const result = await callCommand({ args, lnd: lightning.lnd });

    console.log('call----', result.call);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
