import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const ChartFeesEarnedCommand = commands.find(n => n.value === 'ChartFeesEarned');

test.describe('Test the ChartFeesEarned command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the ChartFeesEarned command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Chart Fees Earned');
    await expect(page).toHaveTitle('Chart Fees Earned');

    await page.type(`#${ChartFeesEarnedCommand?.args?.via}`, 'outpeers');
    await page.type(`#${ChartFeesEarnedCommand?.flags?.days}`, '10');
    await page.check(`#${ChartFeesEarnedCommand?.flags?.count}`);
    await page.check(`#${ChartFeesEarnedCommand?.flags?.forwarded}`);
    await page.type('#node-0', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Chart Fees Earned Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#ChartFeesEarnedOutput')).toBeVisible();
    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
