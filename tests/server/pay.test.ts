import { AuthenticatedLnd, CreateInvoiceResult, createInvoice } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { payCommand } from '../../src/server/commands';

test.describe('Test Pay command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let lightning: LightningCluster;
  let logger: Logger;
  let bobInvoice: CreateInvoiceResult;
  let [alice, bob]: any[] = [];

  test.beforeAll(async () => {
    logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'send' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    lightning = await spawnLightningCluster({ size: 2 });
    [alice, bob] = lightning.nodes;

    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: bob });

    bobInvoice = await createInvoice({ lnd: bob.lnd, tokens: 100 });
  });

  test('run pay command', async () => {
    const args = {
      avoid: [],
      is_strict_max_fee: true,
      request: bobInvoice.request,
      out: [],
      max_fee: 100,
    };

    try {
      const result = await payCommand({
        logger,
        lnd: alice.lnd,
        args,
      });

      console.log('pay----', result);
      expect(result).toBeTruthy();
    } catch (error) {
      console.log('pay error----', error);
      expect(JSON.stringify(error)).toContain('UnexpectedErrInGetRouteToDestination');
    }
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
