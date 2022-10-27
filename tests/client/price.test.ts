import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const PriceCommand = commands.find(n => n.value === 'Price');

test.describe('Test the Price command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Price command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Price');
    await expect(page).toHaveTitle('Price');

    await page.type(`#${PriceCommand?.args?.symbols}`, 'USD,AUD');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#priceoutput')).toBeVisible();
    await page.click('text=home');
  });

  test('test the Price command page and input values with file', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Price');
    await expect(page).toHaveTitle('Price');

    await page.type(`#${PriceCommand?.args?.symbols}`, 'USD,AUD');
    await page.check(`#${PriceCommand?.flags?.file}`);

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#priceJson')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
