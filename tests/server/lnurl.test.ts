import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import spawnLightningServer, { SpawnLightningServerType } from '../utils/spawn_lightning_server.js';

import auth from '../../src/server/commands/lnurl/auth';
import channel from '../../src/server/commands/lnurl/channel';
import request from 'balanceofsatoshis/commands/simple_request';
import { testConstants } from '../utils/constants.js';

test.describe('Test Lnurl command on the node.js side', async () => {
  let lightning: SpawnLightningServerType;
  let logger: Logger;

  test.beforeAll(async () => {
    lightning = await spawnLightningServer();

    logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'lnurl' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });
  });

  test('run lnurl command: auth', async () => {
    const args = {
      lnd: lightning.lnd,
      lnurl: testConstants.lnurlAuth,
      request,
      logger,
    };
    const result = (await auth(args)).send;
    console.log('lnurl auth----', result);
    expect(result).toBeTruthy();
  });

  test('run lnurl command: channel', async () => {
    const args = {
      is_private: true,
      lnurl: testConstants.lnurlChannel,
      lnd: lightning.lnd,
      request,
      logger,
    };
    const result = await channel(args);
    console.log('lnurl channel----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
