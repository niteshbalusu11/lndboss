import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const ChartFeesPaidCommand = commands.find(n => n.value === 'ChartFeesPaid');

test.describe('Test the ChartFeesPaid command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the ChartFeesPaid command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Chart Fees Paid');
    await expect(page).toHaveTitle('Chart Fees Paid');
    await page.type(`#${ChartFeesPaidCommand?.flags.days}`, '10');
    await page.type(
      `#${ChartFeesPaidCommand?.flags.in}`,
      '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb'
    );
    await page.type(
      `#${ChartFeesPaidCommand?.flags.out}`,
      '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb'
    );
    await page.check(`#${ChartFeesPaidCommand?.flags.is_most_fees_table}`);
    await page.check(`#${ChartFeesPaidCommand?.flags.is_most_forwarded_table}`);
    await page.check(`#${ChartFeesPaidCommand?.flags.is_peer}`);
    await page.check(`#${ChartFeesPaidCommand?.flags.is_rebalances_only}`);
    await page.type('#node-0', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Chart Fees Paid Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#ChartFeesPaidOutput')).toBeVisible();
    await expect(popup.locator('#ChartFeesPaidResult')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
