import { AuthenticatedLnd, GetWalletInfoResult, getWalletInfo } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { probeCommand } from '../../src/server/commands';

test.describe('Test Send command on the node.js side', async () => {
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
      defaultMeta: { service: 'probe' },
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

  test('run probe command', async () => {
    const args = {
      avoid: [],
      destination: bobWallet.public_key,
      tokens: '10',
    };

    try {
      const result = await probeCommand({
        logger,
        lnd: alice.lnd,
        args,
      });

      console.log('probe----', result);
      expect(result).toBeTruthy();
    } catch (error) {
      console.log('probe error----', error);
      expect(JSON.stringify(error)).toContain('UnexpectedErrInGetRouteToDestination');
    }
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
