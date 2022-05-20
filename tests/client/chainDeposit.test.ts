import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

try {
  test.describe('Test the ChainDeposit command client page', async () => {
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
      await page.click('text=Chain Deposit');
      await expect(page).toHaveTitle('Chain Deposit');
      await page.type(`#${ChainDepositCommand.flags.amount}`, '1000');
      await page.click('text=run command');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
