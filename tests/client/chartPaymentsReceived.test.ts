import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';

const ChartPaymentsReceivedCommand = commands.find(n => n.value === 'ChartPaymentsReceived');

test.describe('Test the ChartPaymentsReceived command client page', async () => {
  test('test the ChartPaymentsReceived command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Chart Payments Received');
    await expect(page).toHaveTitle('Chart Payments Received');
    await page.type(`#${ChartPaymentsReceivedCommand?.flags.days}`, '10');
    await page.type('#node-0', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Chart Payments Received Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#ChartPaymentsReceivedOutput')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });
});
