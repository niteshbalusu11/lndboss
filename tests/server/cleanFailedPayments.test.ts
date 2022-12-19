import { Logger, createLogger, format, transports } from 'winston';
import { SpawnLightningServerType, spawnLightningServer } from '../utils/spawn_lightning_server';
import { expect, test } from '@playwright/test';

import { cleanFailedPaymentsCommand } from '../../src/server/commands/';

test.describe('Test CleanFailedPayments command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;
  let logger: Logger;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();
    logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'cleanfailedpayments' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });
  });

  test('run CleanFailedPayments command (dryrun)', async () => {
    const args = {
      is_dry_run: true,
    };
    const { result } = await cleanFailedPaymentsCommand({ args, logger, lnd: lightning.lnd });
    console.log('clean failed payments----', result);
    expect(result).toBeDefined();
  });

  test('run CleanFailedPayments command', async () => {
    const args = {
      is_dry_run: false,
    };
    const { result } = await cleanFailedPaymentsCommand({ args, logger, lnd: lightning.lnd });
    console.log('clean failed payments----', result);
    expect(result).toBeDefined();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
