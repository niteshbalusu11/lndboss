import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const ClosedCommand = commands.find(n => n.value === 'Closed');

test.describe('Test the Closed command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the ChainDeposit command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Closed');
    await expect(page).toHaveTitle('Closed');

    await page.type(`#${ClosedCommand?.flags?.limit}`, '5');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#closedoutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
