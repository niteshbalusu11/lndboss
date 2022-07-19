import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const ChainfeesCommand = commands.find(n => n.value === 'Chainfees');

test.describe('Test the Chainfees command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Chainfees command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Chain Fees');
    await expect(page).toHaveTitle('Chain Fees');

    await page.type(`#${ChainfeesCommand?.flags?.blocks}`, '6');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#chainfeesOutput')).toBeVisible();
    await page.click('text=home');
  });

  test('test the Chainfees command page and input values with file', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Chain Fees');
    await expect(page).toHaveTitle('Chain Fees');

    await page.type(`#${ChainfeesCommand?.flags?.blocks}`, '6');
    await page.check(`#${ChainfeesCommand?.flags?.file}`);

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#chainfeesOutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
