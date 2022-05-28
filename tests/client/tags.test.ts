import { ElectronApplication, expect, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
import commands from '../../renderer/commands';

const TagsCommand = commands.find(n => n.value === 'Tags');

try {
  test.describe('Test the Tags command client page', async () => {
    let electronApp: ElectronApplication;
    let page: Page;

    test.beforeAll(async () => {
      electronApp = await electron.launch({ args: ['http://localhost:8888/Commands'] });

      const appPath = await electronApp.evaluate(async ({ app }) => {
        return app.getAppPath();
      });
      console.log(`appPath----${appPath}`);
      page = await electronApp.firstWindow();
    });

    test('test the Tags command page and input values', async () => {
      // Tag type display
      await page.click('text=Tags');
      await expect(page).toHaveTitle('Tags');
      await page.locator('#tag-type').click();
      await page.locator('#display').click();

      // Tag type add
      await page.locator('#tag-type').click();
      await page.locator('#add').click();
      await page.type(`#${TagsCommand.args.tag}`, 'test');
      await page.type('#pubkey-0', 'test');

      // Tag type remove
      await page.locator('#tag-type').click();
      await page.locator('#remove').click();
      await page.type(`#${TagsCommand.args.tag}`, 'test');
      await page.type('#pubkey-0', 'test');

      await page.click('text=home');
    });

    test.afterAll(async () => {
      await electronApp.close();
    });
  });
} catch (error) {
  throw error;
}
