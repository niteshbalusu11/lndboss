import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import { testConstants } from '../utils/constants';

test.describe('Test the Fees command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Fees command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Fees');
    await expect(page).toHaveTitle('Fees');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#feesOutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
