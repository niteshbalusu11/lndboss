import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import { accountingCommand } from '../../src/server/commands/';

test.describe('Test Accounting command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
  });

  test('run accounting command for chain-fees', async () => {
    const args = {
      category: 'chain-fees',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting chain-fees----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command chain-receives', async () => {
    const args = {
      category: 'chain-receives',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting chain-receives----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command chain-sends', async () => {
    const args = {
      category: 'chain-sends',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting chain-sends----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command forwards', async () => {
    const args = {
      category: 'forwards',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting forwards----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command invoices', async () => {
    const args = {
      category: 'invoices',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting invoices----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command payments', async () => {
    const args = {
      category: 'payments',
      month: '6',
      node: '',
      year: '2022',
      is_csv: false,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting payments----', result);
    expect(result).toBeTruthy();
  });

  test('run accounting command payments with csv', async () => {
    const args = {
      category: 'payments',
      month: '6',
      node: '',
      year: '2022',
      is_csv: true,
      is_fiat_disabled: true,
      rate_provider: '',
    };

    const { result } = await accountingCommand(args, lightning.lnd);

    console.log('accounting payments with csv----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
