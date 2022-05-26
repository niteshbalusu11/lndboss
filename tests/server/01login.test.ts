import { expect, test } from '@playwright/test';
import spawnLightning from '../utils/spawn_lightning.js';
import { SpawnLightningType } from '../utils/spawn_lightning.js';
import putSavedCredentials from '../../main/lnd/put_saved_credentials.js';
import lndCredentials from '../../main/lnd/lnd_credentials.js';

try {
  test.describe('Test authentication from node.js side', async () => {
    let lightning: SpawnLightningType;

    test.beforeAll(async () => {
      lightning = await spawnLightning();
    });

    test('add a new saved node credential', async () => {
      const node = 'testnode1';
      const { error, result } = await putSavedCredentials({
        cert: lightning.cert,
        macaroon: lightning.macaroon,
        socket: lightning.socket,
        node,
        is_default: true,
      });
      expect(error).toBe(undefined);
      expect(result).toBeTruthy();
      console.log(`credentials----${result}`);
    });

    test('get saved node credential', async () => {
      const node = 'testnode1';
      const { error, macaroon, socket } = await lndCredentials({ node });
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
