import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const InvoiceCommand = commands.find(n => n.value === 'Invoice');

test.describe('Test the Invoice command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Invoice command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Invoice');
    await expect(page).toHaveTitle('Invoice');

    await page.type(`#${InvoiceCommand?.args?.amount}`, '1000');
    await page.type('#node', 'testnode1');
    await page.type(`#${InvoiceCommand?.flags?.description}`, 'some description');
    await page.type(`#${InvoiceCommand?.flags?.expires_in}`, '5');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#createinvoiceoutput')).toBeVisible();
    await expect(page.locator('#invoice')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
