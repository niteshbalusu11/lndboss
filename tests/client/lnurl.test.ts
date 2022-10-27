import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const LnurlCommand = commands.find(n => n.value === 'Lnurl');

test.describe('Test the Lnurl command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Lnurl command page: auth', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Lnurl');
    await expect(page).toHaveTitle('Lnurl');
    await page.locator('#function').click();
    await page.locator(`#${LnurlCommand?.args?.auth}`).click();

    await page.type(`#${LnurlCommand?.flags?.url}`, testConstants.lnurlAuth);
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Lnurl Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#lnurlResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Lnurl command page: channel', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Lnurl');
    await expect(page).toHaveTitle('Lnurl');
    await page.locator('#function').click();
    await page.locator(`#${LnurlCommand?.args?.channel}`).click();
    await page.check(`#${LnurlCommand?.flags?.is_private}`);
    await page.type(`#${LnurlCommand?.flags?.url}`, testConstants.lnurlChannel);
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Lnurl Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#lnurlResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Lnurl command page: pay', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Lnurl');
    await expect(page).toHaveTitle('Lnurl');
    await page.locator('#function').click();
    await page.locator(`#${LnurlCommand?.args?.pay}`).click();

    await page.type(`#${LnurlCommand?.flags?.url}`, testConstants.lnurlPay);
    await page.type(`#${LnurlCommand?.flags?.amount}`, '5');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Lnurl Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#lnurlResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Lnurl command page: withdraw', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Lnurl');
    await expect(page).toHaveTitle('Lnurl');
    await page.locator('#function').click();
    await page.locator(`#${LnurlCommand?.args?.withdraw}`).click();

    await page.type(`#${LnurlCommand?.flags?.url}`, testConstants.lnurlWithdraw);
    await page.type(`#${LnurlCommand?.flags?.amount}`, '4');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Lnurl Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#lnurlResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
