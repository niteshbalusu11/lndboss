import { expect, test } from '@playwright/test';

import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

test.describe('Test the Open command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Open page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Open');
    await expect(page).toHaveTitle('Open');

    await page.type(`#pubkey-0`, '034f94cccfb1ce5c31e0a367d4ee556f66a865b54b389f15781cacd6ed6611976d');
    await page.type(`#amount-0`, '100000');
    await page.type(`#address-0`, 'bcrt1qtdgrtstez46e8umx49tq22sh7terccyxjmwt2w');
    await page.type(`#give-0`, '100000');
    await page.type('#node', 'testnode1');

    await page.click('text=Validate and Open Channels');
    await page.waitForTimeout(1000);

    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
