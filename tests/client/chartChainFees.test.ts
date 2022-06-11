import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';

const ChartChainFeesCommand = commands.find(n => n.value === 'ChartChainFees');

test.describe('Test the ChartChainFees command client page', async () => {
  test('test the ChartChainFees command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Chart Chain Fees');
    await expect(page).toHaveTitle('Chart Chain Fees');

    await page.type(`#${ChartChainFeesCommand?.flags.days}`, '10');
    await page.type('#node-0', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Chart Chain Fees Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#ChartChainFeesOutput')).toBeVisible();
    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });
});
