import { expect, test } from '@playwright/test';

import commands from '../../src/client/commands';
import { loginForTests } from '../utils/setAccessToken';
import { testConstants } from '../utils/constants';

const TagsCommand = commands.find(n => n.value === 'Tags');

test.describe('Test the Tags command client page', async () => {
  test.beforeEach(async ({ page }) => {
    await loginForTests({ page });
  });

  test('test the Tags command page and input values', async ({ page }) => {
    await page.goto(testConstants.commandsPage); // Tag type display
    await page.click('text=Tags');
    await expect(page).toHaveTitle('Tags');
    await page.locator('#tag-type').click();
    await page.locator('#display').click();
    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#tags')).toBeVisible();

    // Tag type add
    await page.locator('#tag-type').click();
    await page.locator('#add').click();
    await page.type(`#${TagsCommand?.args?.tag}`, 'playwrighttest');
    await page.type(`#${TagsCommand?.flags?.icon}`, '🚀');
    await page.type('#pubkey-0', '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb');
    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#tags')).toBeVisible();
    await page.type('#pubkey-0', '');

    // Tag type remove
    await page.locator('#tag-type').click();
    await page.locator('#remove').click();
    await page.type(`#${TagsCommand?.args?.tag}`, 'playwrighttest');
    await page.type('#pubkey-0', '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb');
    await page.type(`#${TagsCommand?.flags?.icon}`, '🚀');
    await page.click('text=run command');
    await page.waitForTimeout(1000);

    await expect(page.locator('#tags')).toBeVisible();

    await page.click('text=home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
