import { expect, test } from '@playwright/test';
import commands from '../../renderer/commands';
import { electronApp, page } from './_startupElectron.test';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

try {
  test.describe('Test the ChainDeposit command client page', async () => {
    test.beforeAll(async () => {
      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
    });

    test('test the ChainDeposit command page and input values', async () => {
      await page.click('text=Chain Deposit');
      await expect(page).toHaveTitle('Chain Deposit');
      await page.type(`#${ChainDepositCommand.flags.amount}`, '1000');
      await page.click('text=home');
    });
  });
} catch (error) {
  throw error;
}
