import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const PeersCommand = commands.find(n => n.value === 'Peers');

test.describe('Test the Peers command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Peers command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Peers');
    await expect(page).toHaveTitle('Peers');

    await page.check(`#${PeersCommand?.flags?.active}`);
    await page.check(`#${PeersCommand?.flags?.public}`);
    await page.type(`#${PeersCommand?.flags?.idle_days}`, '20');
    await page.type(`#${PeersCommand?.flags?.sort}`, 'inbound_liquidity');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#peersOutput')).toBeVisible();
    await page.click('text=home');
  });

  test('test the Peers command page and input values with complete flag', async ({ page }) => {
    await page.goto(testConstants.commandsPage);
    await page.click('#Peers');
    await expect(page).toHaveTitle('Peers');

    await page.check(`#${PeersCommand?.flags?.active}`);
    await page.check(`#${PeersCommand?.flags?.complete}`);
    await page.check(`#${PeersCommand?.flags?.public}`);
    await page.type(`#${PeersCommand?.flags?.idle_days}`, '20');
    await page.type(`#${PeersCommand?.flags?.sort}`, 'inbound_liquidity');

    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#peersOutputComplete')).toBeVisible();
    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
