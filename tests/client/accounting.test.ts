import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';

const AccountingCommand = commands.find(n => n.value === 'Accounting');

test.describe('Test the Accounting command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Accounting command page: chain-fees', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.chainFees}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: chain-receives', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.chainReceives}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: chain-sends', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.chainSends}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: forwards', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.forwards}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: invoices', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.invoices}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: payments', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.invoices}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#AccountingSummary')).toBeVisible();
    await expect(popup.locator('#AccountingData')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Accounting command page: CSV', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Accounting');
    await expect(page).toHaveTitle('Accounting');
    await page.locator('#category').click();
    await page.locator(`#${AccountingCommand?.args?.invoices}`).click();
    await page.check(`#${AccountingCommand?.flags?.is_fiat_disabled}`);
    await page.check(`#${AccountingCommand?.flags?.is_csv}`);
    await page.type(`#${AccountingCommand?.flags?.month}`, '6');
    await page.type(`#${AccountingCommand?.flags?.year}`, '2022');
    await page.type(`#${AccountingCommand?.flags?.rate_provider}`, 'coindesk');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Accounting Result');
    await popup.waitForTimeout(1000);

    await expect(popup.locator('#accountingCsv')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
