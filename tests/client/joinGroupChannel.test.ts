import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { setCookie } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const JoinGroupChannelCommand = commands.find(n => n.value === 'JoinGroupChannel');

test.describe('Test the Join Group Channel command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setCookie({ page });
  });

  test('test the Join Group Channel command page and input values', async ({ page }) => {
    test.slow();
    await page.goto(testConstants.commandsPage);
    await page.click('text=Join Group Channel');
    await expect(page).toHaveTitle('Join Group Channel');

    await page.type(
      `#${JoinGroupChannelCommand?.args?.code}`,
      '023d8b17ae417518ef86d5471dfd5010b47cfb896812924f1ac8102ff8b76fa3fe47c004c6c6202060d5be81fe7ae90652'
    );
    await page.type(`#${JoinGroupChannelCommand?.flags?.max_fee_rate}`, '2');

    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    // await expect(page.locator('#Joingroupchanneloutput')).toBeVisible(); // Need docker daemons to be able to generate coins
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.close();
  });
});
