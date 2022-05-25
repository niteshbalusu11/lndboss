import { ElectronApplication, Page, test } from '@playwright/test';
import { _electron as electron } from 'playwright';
let electronApp: ElectronApplication;
let page: Page;

try {
  test.beforeAll(async () => {
    console.log('beforeAll');
    electronApp = await electron.launch({ args: ['http://localhost:8888/home'] });

    const appPath = await electronApp.evaluate(async ({ app }) => {
      return app.getAppPath();
    });
    console.log(`appPath----${appPath}`);
    page = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    console.log('closing electronApp');
    await electronApp.close();
  });
} catch (error) {
  throw error;
}

export { electronApp, page };
