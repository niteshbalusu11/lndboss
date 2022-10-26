import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const BalanceCommand = commands.find(n => n.value === 'Balance');

test.describe('Test the Balance command client page', async () => {
  test.beforeEach(async ({ context }) => {});

  test('Test the Balance command page and input values', async ({ context }) => {
    const token = await setAccessToken({ context });
    await context.addCookies([
      {
        url: 'http://[::1]:8055',
        name: 'lndboss-cookie',
        sameSite: 'Strict',
        value: token,
      },
    ]);

    // console.log((await context.storageState()).cookies);
    console.log(await context.cookies());
    const page = await context.newPage();
    await page.goto(testConstants.commandsPage);

    page.on('console', msg => {
      console.log(msg);
    });

    await page.click('text=Balance');
    await expect(page).toHaveTitle('Balance');

    await page.type(`#${BalanceCommand?.flags?.above}`, '1000');
    await page.type(`#${BalanceCommand?.flags?.below}`, '1000');
    await page.check(`#${BalanceCommand?.flags?.confirmed}`);
    await page.check(`#${BalanceCommand?.flags?.detailed}`);
    await page.check(`#${BalanceCommand?.flags?.offchain}`);
    await page.check(`#${BalanceCommand?.flags?.onchain}`);
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

  test.afterEach(async ({ browser, page }) => {
    await removeAccessToken({ browser, page });
  });
});
