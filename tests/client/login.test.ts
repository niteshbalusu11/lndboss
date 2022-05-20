import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';

try {
  test.describe('Test the login page and check authentication', async () => {
    let electronApp: ElectronApplication;
    let page: Page;

    test.beforeAll(async () => {
      electronApp = await electron.launch({ args: ['http://localhost:8888/home'] });

      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
      page = await electronApp.firstWindow();
    });

    test('render the login page and input values', async () => {
      await page.click('text=LOGIN');
      await expect(page).toHaveTitle('Authentication');
      await page.type('#cert', 'lightning.cert');
      await page.type('#macaroon', 'lightning.macaroon');
      await page.type('#socket', 'lightning.socket');
      await page.click('text=authenticate');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
