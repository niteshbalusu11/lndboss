import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const BalanceCommand = commands.find(n => n.value === 'Balance');

try {
  test.describe('Test the Balance command client page', async () => {
    let electronApp: ElectronApplication;
    let page: Page;

    test.beforeAll(async () => {
      electronApp = await electron.launch({ args: ['http://localhost:8888/Commands'] });

      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
      page = await electronApp.firstWindow();
    });

    test('Test the Balance command page and input values', async () => {
      await page.click('text=Balance');
      await expect(page).toHaveTitle('Balance');
      await page.type(`#${BalanceCommand.flags.above}`, '1000');
      await page.type(`#${BalanceCommand.flags.below}`, '1000');
      await page.check(`#${BalanceCommand.flags.confirmed}`);
      await page.check(`#${BalanceCommand.flags.detailed}`);
      await page.check(`#${BalanceCommand.flags.offchain}`);
      await page.check(`#${BalanceCommand.flags.onchain}`);
      await page.type('#node', 'testnode1');
      await page.click('text=home');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
