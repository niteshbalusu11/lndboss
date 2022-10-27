import { FullConfig, chromium } from '@playwright/test';

import { cwd } from 'process';
import dotenv from 'dotenv';
import { join } from 'path';
import { startGlobalContainer } from './global_spawn_lightning';
// Read from default ".env" file.
import { testConstants } from './constants';

dotenv.config();

// Alternatively, read from "../my.env" file.
dotenv.config({ path: join(__dirname, '../../.env') });

async function globalSetup() {
  await startGlobalContainer();
  console.log('======================Started Global Container======================');

  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // const password = process.env.TESTING_PASSWORD!;
  // const username = process.env.TESTING_USERNAME!;

  // await page.goto('http://[::1]:8055/auth/Login');
  // await page.type(`#accountName`, username!);
  // await page.type(`#password`, password!);
  // await page.click('#login');
  // console.log(await page.context().cookies('http://[::1]:8055'));
  // await page.context().storageState({ path: join(cwd(), 'storage.json') });
  // await browser.close();
}

export default globalSetup;
