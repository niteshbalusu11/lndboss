import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

test.describe('Test the ChainDeposit command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the ChainDeposit command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Chain Deposit');
    await expect(page).toHaveTitle('Chain Deposit');

    await page.type(`#${ChainDepositCommand?.args?.amount}`, '1000');
    await page.type('#node', 'testnode1');
    await page.type(`#${ChainDepositCommand?.flags?.format}`, 'p2wpkh');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#qrcode')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
