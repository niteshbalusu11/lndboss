import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const PayCommand = commands.find(n => n.value === 'Pay');

test.describe('Test the Pay command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Pay command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Pay');
    await expect(page).toHaveTitle('Pay');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${PayCommand?.args?.request}`, 'lnbcrt5u1p30uwmupp5an4d8hl3dhc25qxmwusfk42gzfpjxqmy6wlva7wnemfl5rxhmafsdqqcqzpgxqyz5vqsp577dvdtj3krjdsc5d2ut62zgkehl7m9s64q0dw9awt94kyvjgwnfs9qyyssqy0yq9uxazv37lzkm2lkqmsn4lrhse3536d04f8edpfkjk4vl6t3hvmt4du2zmu0ukwrjvwvg9g3tr03fxch888j06qmr5se82vp77gspp3alcj');
    await page.type(`#${PayCommand?.flags?.in}`, 'carol');
    await page.type(`#out-0`, 'bob');
    await page.type(`#${PayCommand?.flags?.max_fee}`, '1000');
    await page.type(`#${PayCommand?.flags?.message}`, 'test message');

    await page.type('#node', 'alice');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Pay Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#payResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
