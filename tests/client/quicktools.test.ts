import { expect, test } from '@playwright/test';

import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

test.describe('Test the Quick Tools client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Create Invoice quick tools page and input values', async ({ page }) => {
    await page.goto(testConstants.quickToolsPage);
    await expect(page).toHaveTitle('Quick Tools');
    await page.click('text=Create Invoice');

    await page.type(`#amount`, '1000');
    await page.type('#node', 'testnode1');

    await page.click('#createinvoice');
    await page.waitForTimeout(1000);

    await expect(page.locator('#createinvoiceoutput')).toBeVisible();
    await expect(page.locator('#invoice')).toBeVisible();
  });

  test('test the Create Chain Address quick tools page and input values', async ({ page }) => {
    await page.goto(testConstants.quickToolsPage);
    await expect(page).toHaveTitle('Quick Tools');
    await page.click('text=Create OnChain Address');

    await page.type(`#amount`, '1000');
    await page.type('#node', 'testnode1');

    await page.click('#createchainaddress');
    await page.waitForTimeout(1000);

    await expect(page.locator('#createchainaddressoutput')).toBeVisible();
    await expect(page.locator('#chainaddress')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
