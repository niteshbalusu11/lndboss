import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import { testConstants } from '../utils/constants';

test.describe('Test the login page and check authentication', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('Test the login page and input values: type credentials', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Menu');
    await page.click('text=Authenticate');
    await expect(page).toHaveTitle('Authentication');

    await page.locator('#selectauthtype').click();
    await page.locator('#credentials').click();
    await page.type('#node', 'testnode');
    await page.type('#cert', 'cert');
    await page.type('#macaroon', 'macaroon');
    await page.type('#socket', 'socket');

    await page.click('text=authenticate');
    await page.click('text=home');
  });

  test('Test the login page and input values: type path', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Menu');
    await page.click('text=Authenticate');
    await expect(page).toHaveTitle('Authentication');

    await page.locator('#selectauthtype').click();
    await page.locator('#path').click();
    await page.locator('#selectnetwork').click();
    await page.locator('#regtest').click();
    await page.type('#directorypath', 'directorypath');
    await page.type('#socket', 'socket');
    await page.type('#node', 'testnode');

    await page.click('text=authenticate');
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
