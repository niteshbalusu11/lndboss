import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChartChainFeesCommand = commands.find(n => n.value === 'ChartChainFees');

try {
  test.describe('Test the ChartChainFees command client page', async () => {
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

    test('test the ChartChainFees command page and input values', async () => {
      await page.click('text=Chart Chain Fees');
      await expect(page).toHaveTitle('Chart Chain Fees');
      await page.type(`#${ChartChainFeesCommand.flags.days}`, '10');
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
