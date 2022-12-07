import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const UtxosCommand = commands.find(n => n.value === 'Utxos');

test.describe('Test the Utxos command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Utxos command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Utxos');
    await expect(page).toHaveTitle('Utxos');

    await page.type(`#${UtxosCommand?.flags?.count_below}`, '0');
    await page.type(`#${UtxosCommand?.flags?.size}`, '0');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#utxosoutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
