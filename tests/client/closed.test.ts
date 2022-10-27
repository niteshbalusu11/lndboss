import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const ClosedCommand = commands.find(n => n.value === 'Closed');

test.describe('Test the Closed command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Forwards command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Closed');
    await expect(page).toHaveTitle('Closed');

    await page.type(`#${ClosedCommand?.flags?.limit}`, '5');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#closedoutput')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
