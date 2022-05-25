import { expect, test } from '@playwright/test';
import commands from '../../renderer/commands';
import { electronApp, page } from './_startupElectron.test';

const BalanceCommand = commands.find(n => n.value === 'Balance');

try {
  test.describe('Test the Balance command client page', async () => {
    test.beforeAll(async () => {
      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
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
      await page.click('text=home');
    });
  });
} catch (error) {
  throw error;
}
