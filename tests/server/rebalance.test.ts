import { AuthenticatedLnd, getWalletInfo } from 'lightning';
import { Logger, createLogger, format, transports } from 'winston';
import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { manageRebalance } from 'balanceofsatoshis/swaps';
import { readFile } from 'fs';

test.describe('Test Rebalance command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let lightning: LightningCluster;
  let logger: Logger;

  test.beforeAll(async () => {
    logger = createLogger({
      level: 'info',
      format: format.combine(format.prettyPrint()),
      defaultMeta: { service: 'rebalance' },
      transports: [
        new transports.Console({
          format: format.combine(format.prettyPrint()),
        }),
      ],
    });

    lightning = await spawnLightningCluster({ size: 3 });
  });

  test('run forwards command', async () => {
    const [alice, bob, carol] = lightning.nodes;

    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: bob });
    await setupChannel({ generate: bob.generate, lnd: bob.lnd, to: carol });
    await setupChannel({ generate: carol.generate, lnd: carol.lnd, to: alice });

    const bobWallet = await getWalletInfo({ lnd: bob.lnd });
    const carolWallet = await getWalletInfo({ lnd: carol.lnd });

    const args = {
      avoid: [],
      in_filters: [],
      in_outbound: 0,
      in_through: carolWallet.public_key,
      max_fee: 100,
      max_fee_rate: 100,
      max_rebalance: '50000',
      out_filters: [],
      out_inbound: 0,
      out_through: bobWallet.public_key,
      timeout_minutes: 1,
    };

    const result = await manageRebalance({
      lnd: alice.lnd,
      logger,
      avoid: args.avoid,
      fs: { getFile: readFile },
      in_filters: args.in_filters,
      in_outbound: args.in_outbound || undefined,
      in_through: args.in_through || undefined,
      max_fee: args.max_fee || 1337,
      max_fee_rate: args.max_fee_rate || 250,
      max_rebalance: args.max_rebalance,
      out_filters: args.out_filters,
      out_inbound: args.out_inbound || undefined,
      out_through: args.out_through || undefined,
      timeout_minutes: args.timeout_minutes || 5,
    });

    console.log('rebalance----', result);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
