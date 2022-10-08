import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { chainDepositCommand } from '../../src/server/commands/';

test.describe('Test ChainDeposit command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run ChainDeposit command', async () => {
    const args = {
      amount: 1000,
      format: 'p2wpkh',
    };
    const { result } = await chainDepositCommand({ args, lnd: lightning.lnd });
    console.log('chain deposit----', result);
    expect(result.address).toBeTruthy();
    expect(result.url).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
