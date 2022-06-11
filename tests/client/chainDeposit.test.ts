import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

test.describe('Test the ChainDeposit command client page', async () => {
  test('test the ChainDeposit command page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Chain Deposit');
    await expect(page).toHaveTitle('Chain Deposit');

    await page.type(`#${ChainDepositCommand?.args?.amount}`, '1000');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#qrcode')).toBeVisible();
    await page.click('text=home');
  });
});
