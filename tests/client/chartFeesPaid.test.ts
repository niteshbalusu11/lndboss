import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChartFeesPaidCommand = commands.find(n => n.value === 'ChartFeesPaid');

try {
  test.describe('Test the ChartFeesPaid command client page', async () => {
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
      await page.check(`#${ChartFeesPaidCommand.flags.is_network}`);
      await page.check(`#${ChartFeesPaidCommand.flags.is_peer}`);
      await page.check(`#${ChartFeesPaidCommand.flags.is_rebalances_only}`);
      await page.click('text=Add');
      await page.type('#node-1', 'testnode2');
      await page.click('text=Add');
      await page.type('#node-2', 'testnode3');
      await page.click('text=home');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
