import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import { testConstants } from '../utils/constants';

test.describe('Test the Reconnect command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Reconnect command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Reconnect');
    await expect(page).toHaveTitle('Reconnect');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#reconnectOutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
