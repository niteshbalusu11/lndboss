import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { balanceCommand } from '../../src/server/commands/';

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
      is_detailed: false,
      node: '',
    };
    const { result } = await balanceCommand({ args, lnd: lightning.lnd });

    console.log('balance----', result);
    expect(result).toBeTruthy();
  });

  test('run balance command detailed', async () => {
    const args = {
      above: 0,
      below: 0,
      is_confirmed: true,
      is_offchain_only: false,
      is_onchain_only: false,
      is_detailed: true,
      node: '',
    };
    const { result } = await balanceCommand({ args, lnd: lightning.lnd });

    console.log('balance----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
