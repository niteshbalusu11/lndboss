import { ElectronApplication, expect, Page, test } from '@playwright/test';
import path from 'path';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const ChartPaymentsReceivedCommand = commands.find(n => n.value === 'ChartPaymentsReceived');

try {
  test.describe('Test the ChartPaymentsReceived command client page', async () => {
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

    test('test the ChartPaymentsReceived command page and input values', async () => {
      await page.click('text=Chart Payments Received');
      await expect(page).toHaveTitle('Chart Payments Received');
      await page.type(`#${ChartPaymentsReceivedCommand.flags.days}`, '10');
      await page.type('#node-0', 'testnode1');

      await page.click('text=run command');
      page = await electronApp.waitForEvent('window');

      await expect(page).toHaveTitle('Chart Payments Received Result');
      await page.waitForTimeout(1000);
      await expect(page.locator('#ChartPaymentsReceivedOutput')).toBeVisible();

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
