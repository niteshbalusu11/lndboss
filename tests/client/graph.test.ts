import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const GraphCommand = commands.find(n => n.value === 'Graph');

test.describe('Test the Graph command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Graph command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Graph');
    await expect(page).toHaveTitle('Graph');

    await page.type(`#${GraphCommand?.args?.alias_or_pubkey}`, 'alice');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
