import { expect, test } from '@playwright/test';
import { removeAccessToken, setAccessToken } from '../utils/setAccessToken';

import commands from '../../src/client/commands';
import { testConstants } from '../utils/constants';

const CertValidityDaysCommand = commands.find(n => n.value === 'CertValidityDays');

test.describe('Test the CertValidityDays command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await setAccessToken({ page });
  });

  test('test the CertValidityDays command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('text=Cert Validity Days');
    await expect(page).toHaveTitle('Cert Validity Days');

    await page.type(`#${CertValidityDaysCommand?.flags?.below}`, '1000');
    await page.type('#node', 'testnode1');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Remaining number of days of certificate validity:')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await removeAccessToken({ page });
  });
});
