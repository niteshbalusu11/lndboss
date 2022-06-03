import { ElectronApplication, expect, Page, test } from '@playwright/test';
import path from 'path';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

try {
  test.describe('Test the ChainDeposit command client page', async () => {
    let electronApp: ElectronApplication;
    let page: Page;

    test.beforeAll(async () => {
      // lightning = await createLogin();
      const launchPath = path.join(__dirname, '../../app/background.js');

      electronApp = await electron.launch({ args: [launchPath] });

      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
      page = await electronApp.firstWindow();
    });

    test('test the ChainDeposit command page and input values', async () => {
      await page.click('text=Chain Deposit');
      await expect(page).toHaveTitle('Chain Deposit');

      await page.type(`#${ChainDepositCommand.args.amount}`, '1000');
      await page.type('#node', 'testnode1');

      await page.click('text=run command');
      await page.waitForTimeout(1000);

      await expect(page.locator('#qrcode')).toBeVisible();
      await page.click('text=home');
    });

    test.afterAll(async () => {
      // await lightning.kill({});
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
