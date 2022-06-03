import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import path from 'path';

try {
  test.describe('Test the login page and check authentication', async () => {
    let electronApp: ElectronApplication;
    let page: Page;

    test.beforeAll(async () => {
      const launchPath = path.join(__dirname, '../../app/background.js');

      electronApp = await electron.launch({ args: [launchPath] });

      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
      page = await electronApp.firstWindow();
    });

    test('Test the login page and input values', async () => {
      await page.click('text=LOGIN');
      await expect(page).toHaveTitle('Authentication');
      await page.type('#node', 'testnode');
      await page.type('#cert', 'cert');
      await page.type('#macaroon', 'macaroon');
      await page.type('#socket', 'socket');

      await page.click('text=authenticate');
      await page.click('text=home');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
