import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import { testConstants } from '../utils/constants';

test.describe('Test the Call command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Call command page: chain-fees', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Call (Experimental)');
    await expect(page).toHaveTitle('Call');
    await page.locator('#rawApiMethodAutoComplete').click();
    await page.locator(`text=createInvoice`).click();
    await page.type('#node', 'testnode1');
    await page.type(`#description`, 'testdescription');
    await page.type(`#mtokens`, '1000');
    await page.type(`#is_including_private_channels`, 'true');
    await page.type(`#cltv_delta`, '144');

    await page.click('text=run command');
    await page.waitForTimeout(1000);
    await expect(page.locator('#callOutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
