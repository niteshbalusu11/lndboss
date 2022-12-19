import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const CleanFailedPaymentsCommand = commands.find(n => n.value === 'CleanFailedPayments');

test.describe('Test the CleanFailedPayments command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the CleanFailedPayments (dryrun) command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Clean Failed Payments');
    await expect(page).toHaveTitle('Clean Failed Payments');
    await page.check(`#${CleanFailedPaymentsCommand?.flags?.dryrun}`);

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#paymentsfound')).toBeVisible();

    await page.click('text=home');
  });

  test('test the CleanFailedPayments command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Clean Failed Payments');
    await expect(page).toHaveTitle('Clean Failed Payments');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#paymentsdeleted')).toBeVisible();

    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
