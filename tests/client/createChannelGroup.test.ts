import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const CreateChannelGroupCommand = commands.find(n => n.value === 'CreateChannelGroup');

test.describe('Test the Create Group Channel command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Create Channel Group command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Create Channel Group');
    await expect(page).toHaveTitle('Create Channel Group');

    await page.type(`#${CreateChannelGroupCommand?.flags?.capacity}`, '100000');
    await page.type(`#${CreateChannelGroupCommand?.flags?.fee_rate}`, '2');
    await page.type(`#${CreateChannelGroupCommand?.flags?.size}`, '2');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    // await expect(page.locator('#creategroupchanneloutput')).toBeVisible(); // Need docker daemons to be able to generate coins
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
