import { ElectronApplication, expect, Page, test } from '@playwright/test';
import path from 'path';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChartFeesPaidCommand = commands.find(n => n.value === 'ChartFeesPaid');

try {
  test.describe('Test the ChartFeesPaid command client page', async () => {
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

    test('test the ChartFeesPaid command page and input values', async () => {
      await page.click('text=Chart Fees Paid');
      await expect(page).toHaveTitle('Chart Fees Paid');
      await page.type(`#${ChartFeesPaidCommand.flags.days}`, '10');
      await page.type(
        `#${ChartFeesPaidCommand.flags.in}`,
        '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb'
      );
      await page.type(
        `#${ChartFeesPaidCommand.flags.out}`,
        '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb'
      );
      await page.check(`#${ChartFeesPaidCommand.flags.is_most_fees_table}`);
      await page.check(`#${ChartFeesPaidCommand.flags.is_most_forwarded_table}`);
      await page.check(`#${ChartFeesPaidCommand.flags.is_peer}`);
      await page.check(`#${ChartFeesPaidCommand.flags.is_rebalances_only}`);
      await page.type('#node-0', 'testnode1');

      await page.click('text=run command');
      page = await electronApp.waitForEvent('window');

      await expect(page).toHaveTitle('Chart Fees Paid Result');
      await page.waitForTimeout(1000);
      await expect(page.locator('#ChartFeesPaidOutput')).toBeVisible();
      await expect(page.locator('#ChartFeesPaidOutputTable')).toBeVisible();

      page = electronApp.windows()[0];
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
