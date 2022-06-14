import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const BalanceCommand = commands.find(n => n.value === 'Balance');

test.describe('Test the Balance command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('Test the Balance command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Balance');
    await expect(page).toHaveTitle('Balance');

    await page.type(`#${BalanceCommand?.flags.above}`, '1000');
    await page.type(`#${BalanceCommand?.flags.below}`, '1000');
    await page.check(`#${BalanceCommand?.flags.confirmed}`);
    await page.check(`#${BalanceCommand?.flags.detailed}`);
    await page.check(`#${BalanceCommand?.flags.offchain}`);
    await page.check(`#${BalanceCommand?.flags.onchain}`);
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=OnchainBalance')).toBeVisible();
    await expect(page.locator('text=OffchainBalance')).toBeVisible();
    await expect(page.locator('text=ClosingBalance')).toBeVisible();
    await expect(page.locator('text=ConflictedPending')).toBeVisible();
    await expect(page.locator('text=InvalidPending')).toBeVisible();

    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
