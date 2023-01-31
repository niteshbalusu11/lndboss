import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const ProbeCommand = commands.find(n => n.value === 'Probe');

test.describe('Test the Probe command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Probe command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Probe');
    await expect(page).toHaveTitle('Probe Command');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${ProbeCommand?.args?.to}`, 'pubkey');
    await page.type(`#${ProbeCommand?.flags?.in}`, 'carol');
    await page.type(`#${ProbeCommand?.args?.amount}`, '50000');
    await page.type(`#${ProbeCommand?.flags?.max_fee}`, '100');

    await page.type('#node', 'alice');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Probe Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#probeResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
