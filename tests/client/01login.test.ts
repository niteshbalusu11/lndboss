import { expect, test } from '@playwright/test';

test.describe('Test the login page and check authentication', async () => {
  test('Test the login page and input values', async ({ page }) => {
    await page.goto('/Commands');
    await page.click('text=Authenticate');
    await expect(page).toHaveTitle('Authentication');
    await page.type('#node', 'testnode');
    await page.type('#cert', 'cert');
    await page.type('#macaroon', 'macaroon');
    await page.type('#socket', 'socket');

    await page.click('text=authenticate');
    await page.click('text=home');
  });
});
