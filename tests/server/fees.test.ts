import { AuthenticatedLnd, GetWalletInfoResult, getWalletInfo } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { feesCommand } from '../../src/server/commands';

test.describe('Test Fees command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let lightning: LightningCluster;
  let logger: Logger;
  let bobWallet: GetWalletInfoResult;
  let [alice, bob]: any[] = [];

  test.beforeAll(async () => {
    logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'fees' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    lightning = await spawnLightningCluster({ size: 2 });
    [alice, bob] = lightning.nodes;

    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: bob });

    bobWallet = await getWalletInfo({ lnd: bob.lnd });
  });

  test('run fees command', async () => {
    const args = {
      cltv_delta: 40,
      fees: '100',
      to: [bobWallet.public_key],
    };

    const result = await feesCommand({
      logger,
      lnd: alice.lnd,
      args,
    });

    console.log('fees----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
