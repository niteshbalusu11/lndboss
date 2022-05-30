import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChartFeesEarnedCommand = commands.find(n => n.value === 'ChartFeesEarned');

try {
  test.describe('Test the ChartFeesEarned command client page', async () => {
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

    test('test the ChartFeesEarned command page and input values', async () => {
      await page.click('text=Chart Fees Earned');
      await expect(page).toHaveTitle('Chart Fees Earned');
      await page.type(`#${ChartFeesEarnedCommand.args.via}`, 'outpeers');
      await page.type(`#${ChartFeesEarnedCommand.flags.days}`, '10');
      await page.check(`#${ChartFeesEarnedCommand.flags.count}`);
      await page.check(`#${ChartFeesEarnedCommand.flags.forwarded}`);
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
