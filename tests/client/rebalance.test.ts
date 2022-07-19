import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const RebalanceCommand = commands.find(n => n.value === 'Rebalance');

test.describe('Test the Rebalance command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Rebalance command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Rebalance');
    await expect(page).toHaveTitle('Rebalance');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${RebalanceCommand?.flags?.in_through}`, 'carol');
    await page.type(`#${RebalanceCommand?.flags?.out_through}`, 'bob');
    await page.type(`#${RebalanceCommand?.flags?.max_rebalance}`, '50000');
    await page.type(`#${RebalanceCommand?.flags?.timeout_minutes}`, '1');
    await page.type('#node', 'alice');

    await page.click('text=run command');
    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Rebalance Result');
    await popup.waitForTimeout(1000);
    await expect(popup.locator('#rebalanceResultTitle')).toBeVisible();

    await popup.close();

    await page.bringToFront();
    await page.click('text=home');
  });

  test('test the Rebalance command page and input values and add schedule', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Rebalance');
    await expect(page).toHaveTitle('Rebalance');
    await page.type(`#avoid-0`, 'ban');
    await page.type(`#${RebalanceCommand?.flags?.in_through}`, 'carol');
    await page.type(`#${RebalanceCommand?.flags?.out_through}`, 'bob');
    await page.type(`#${RebalanceCommand?.flags?.max_rebalance}`, '50000');
    await page.type(`#${RebalanceCommand?.flags?.timeout_minutes}`, '1');
    await page.type('#node', 'alice');

    await page.click('text=Add Schedule');
    await page.click('text=home');
  });

  test('test the rebalance scheduled page', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Rebalance');
    await page.click('text=Click to view current scheduled jobs');

    const popup = await page.waitForEvent('popup');

    await expect(popup).toHaveTitle('Rebalance Scheduler');
    await popup.type('#node', 'alice');

    await popup.click('text=fetch rebalances for saved node');

    await expect(popup.locator('#noRebalanceSchedules')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
