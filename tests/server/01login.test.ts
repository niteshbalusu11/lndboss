import { expect, test } from '@playwright/test';
import spawnLightning from '../utils/spawn_lightning.js';
import { SpawnLightningType } from '../utils/spawn_lightning.js';
import * as lnd from '../../main/lnd';

try {
  test.describe('Test authentication from node.js side', async () => {
    let lightning: SpawnLightningType;

    test.beforeAll(async () => {
      lightning = await spawnLightning();
    });

    test('add a new saved node credential', async () => {
      const node = 'testnode1';
      const { error, result } = await lnd.putSavedCredentials({
        cert: lightning.cert,
        macaroon: lightning.macaroon,
        socket: lightning.socket,
        node,
        is_default: false,
      });
      expect(error).toBe(undefined);
      expect(result).toBeTruthy();
      console.log(`credentials----${result}`);
    });

    test('get saved node credential', async () => {
      const node = 'testnode1';
      const { error, macaroon, socket } = await lnd.lndCredentials({ node });
      expect(error).toBe(undefined);
      expect(macaroon).toBeTruthy();
      expect(socket).toBeTruthy();
      console.log(`credentials----${macaroon} ${socket}`);
    });

    test.afterAll(async () => {
      await lightning.kill({});
    });
  });
} catch (error) {
  throw error;
}
