import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const FindCommand = commands.find(n => n.value === 'Find');

test.describe('Test the Find command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Find command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Find');
    await expect(page).toHaveTitle('Find');

    await page.type(`#${FindCommand?.args?.query}`, 'alice');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#findoutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
