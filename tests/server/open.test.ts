import { AuthenticatedLnd, GetWalletInfoResult, getWalletInfo } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { openCommand } from '../../src/server/commands';

test.describe('Test Open command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let lightning: LightningCluster;
  let logger: Logger;
  let bobWallet: GetWalletInfoResult;
  let carolWallet: GetWalletInfoResult;
  let [alice, bob, carol]: any[] = [];

  test.beforeAll(async () => {
    logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'open' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    lightning = await spawnLightningCluster({ size: 3 });
    [alice, bob, carol] = lightning.nodes;

    bobWallet = await getWalletInfo({ lnd: bob.lnd });
    carolWallet = await getWalletInfo({ lnd: carol.lnd });
    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: bob });
    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: carol });
  });

  test('run open command', async () => {
    const args = {
      ask: [],
      capacities: ['100000', '2000000'],
      cooperative_close_addresses: [],
      gives: [20000, 30000],
      internal_fund_fee_rate: 1,
      is_avoiding_broadcast: false,
      logger,
      public_keys: [bobWallet.public_key, carolWallet.public_key],
      types: ['public', 'private'],
    };

    const result = await openCommand({
      args,
      lnd: alice.lnd,
      logger,
    });

    console.log('open----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
