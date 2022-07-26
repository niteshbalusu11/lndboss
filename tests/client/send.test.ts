import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const SendCommand = commands.find(n => n.value === 'Send');

test.describe('Test the Send command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Send command page and input values', async ({ page }) => {
    await page.goto('/commands/Send');
    await expect(page).toHaveTitle('Send Command');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${SendCommand?.args?.destination}`, 'pubkey');
    await page.type(`#${SendCommand?.flags?.in_through}`, 'carol');
    await page.type(`#${SendCommand?.flags?.out_through}`, 'bob');
    await page.type(`#${SendCommand?.flags?.amount}`, '50000');
    await page.type(`#${SendCommand?.flags?.max_fee}`, '1000');
    await page.type(`#${SendCommand?.flags?.max_fee_rate}`, '1000');
    await page.type(`#${SendCommand?.flags?.message}`, 'test message');

    await page.type('#node', 'alice');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Send Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#sendResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
