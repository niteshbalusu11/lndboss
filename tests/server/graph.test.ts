import { AuthenticatedLnd, GetWalletInfoResult, getWalletInfo } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { graphCommand } from '../../src/server/commands';

test.describe('Test Graph command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let logger: Logger;
  let [alice, bob]: any[] = [];
  let lightning: LightningCluster;
  let bobWallet: GetWalletInfoResult;

  test.beforeAll(async () => {
    logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'graph' },
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

  test('run graph command', async () => {
    const args = {
      filters: [],
      node: '',
      query: bobWallet.public_key,
      sort: '',
    };
    const { result } = await graphCommand({ args, lnd: alice.lnd, logger });
    console.log('graph----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
