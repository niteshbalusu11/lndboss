import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const CreateGroupChannelCommand = commands.find(n => n.value === 'CreateGroupChannel');

test.describe('Test the Create Group Channel command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the Create Group Channel command page and input values', async ({ page }) => {
    test.slow();
    await page.goto(testConstants.commandsPage);
    await page.click('text=Create Group Channel');
    await expect(page).toHaveTitle('Create Group Channel');

    await page.type(`#${CreateGroupChannelCommand?.flags?.capacity}`, '100000');
    await page.type(`#${CreateGroupChannelCommand?.flags?.fee_rate}`, '2');
    await page.type(`#${CreateGroupChannelCommand?.flags?.size}`, '2');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    // await expect(page.locator('#creategroupchanneloutput')).toBeVisible(); // Need docker daemons to be able to generate coins
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
