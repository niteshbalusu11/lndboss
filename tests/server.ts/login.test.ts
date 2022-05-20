import { expect, test } from '@playwright/test';
import spawnLightning from '../utils/spawn_lightning.js';
import { SpawnLightningType } from '../utils/spawn_lightning.js';
import createCredentials from '../../main/auth/create_credentials';

try {
  test.describe('Test authentication from server side', async () => {
    let lightning: SpawnLightningType;

    test.beforeAll(async () => {
      lightning = await spawnLightning();
    });

    test('render the login page and input values', async () => {
      const { error, result } = await createCredentials({
        cert: lightning.cert,
        macaroon: lightning.macaroon,
        socket: lightning.socket,
      });
      console.log(`credentials----${result}`);
      expect(error).toBe(undefined);
      expect(result).toBeTruthy();
    });

    test.afterAll(async () => {
      await lightning.kill({});
    });
  });
} catch (error) {
  throw error;
}
