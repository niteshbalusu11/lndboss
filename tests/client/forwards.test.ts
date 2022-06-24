import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const ForwardsCommand = commands.find(n => n.value === 'Forwards');

test.describe('Test the Forwards command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Forwards command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Forwards');
    await expect(page).toHaveTitle('Forwards');

    await page.type(`#${ForwardsCommand?.flags?.days}`, '10');
    await page.type(`#${ForwardsCommand?.flags?.from}`, 'alice');
    await page.type(`#${ForwardsCommand?.flags?.sort}`, 'earned_out');
    await page.type(`#${ForwardsCommand?.flags?.to}`, 'bob');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#forwardsoutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
