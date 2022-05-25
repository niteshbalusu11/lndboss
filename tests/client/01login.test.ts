import { expect, test } from '@playwright/test';
import { electronApp, page } from './_startupElectron.test';

try {
  test.describe('Test the login page and check authentication', async () => {
    test.beforeAll(async () => {
      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
    });

    test('Test the login page and input values', async () => {
      await page.click('text=LOGIN');
      await expect(page).toHaveTitle('Authentication');
      await page.type('#cert', 'lightning.cert');
      await page.type('#macaroon', 'lightning.macaroon');
      await page.type('#socket', 'lightning.socket');
      await page.click('text=home');
    });
  });
} catch (error) {
  throw error;
}
