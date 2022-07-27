import { expect, test } from '@playwright/test';
import { setupChannel, spawnLightningCluster } from 'ln-docker-daemons';

import { AuthenticatedLnd } from 'lightning';
import { peersCommand } from '../../src/server/commands';

test.describe('Test Peers command on the node.js side', async () => {
  type LightningCluster = {
    lnd: AuthenticatedLnd;
    kill: ({}) => Promise<void>;
    nodes: any[];
  };
  let lightning: LightningCluster;
  let [alice, bob]: any[] = [];

  test.beforeAll(async () => {
    lightning = await spawnLightningCluster({ size: 2 });
    [alice, bob] = lightning.nodes;

    await setupChannel({ generate: alice.generate, lnd: alice.lnd, to: bob });
  });

  test('run peers command with complete', async () => {
    const args = {
      is_active: true,
    };

    const { result } = await peersCommand({
      lnd: alice.lnd,
      args,
    });

    console.log('peers----', result);
    expect(result.peers).toBeTruthy();
    expect(result.rows).toBeTruthy();
  });

  test('run peers command with table', async () => {
    const args = {
      is_active: true,
      is_table: false,
    };

    const { result } = await peersCommand({
      lnd: alice.lnd,
      args,
    });

    console.log('peers----', result);
    expect(result.peers).toBeTruthy();
  });

  test.afterAll(async () => {
    await lightning.kill({});
  });
});
