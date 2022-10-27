import { Page } from '@playwright/test';
import axios from 'axios';
import { testConstants } from './constants';

const setAccessToken = async ({ page }) => {
  const url = process.env.TESTING_URL!;

  const config = {
    headers: { 'Content-Type': 'application/json' },
  };

  const postBody = {
    password: process.env.TESTING_PASSWORD,
    username: process.env.TESTING_USERNAME,
  };

  const response = await axios.post(url, postBody, config);

  const data = await response.data;

  const { accessToken } = data;

  await page.addInitScript(`localStorage.setItem('accessToken', '${accessToken}')`);

  return accessToken;
};

const getAccessToken = async () => {
  const url = 'http://[::1]:8055/api/auth/login';

  const config = {
    headers: { 'Content-Type': 'application/json' },
  };

  const postBody = {
    password: process.env.TESTING_PASSWORD,
    username: process.env.TESTING_USERNAME,
  };

  const response = await axios.post(url, postBody, config);

  const data = await response.data;

  const { accessToken } = data;

  return accessToken;
};

const loginForTests = async ({ page }: { page: Page }) => {
  const password = process.env.TESTING_PASSWORD!;
  const username = process.env.TESTING_USERNAME!;
  console.log(password, username);
  await page.goto(testConstants.loginUrl);
  await page.type(`#accountName`, username!);
  await page.type(`#password`, password!);
  await page.click('#login');
};

const removeAccessToken = async ({ page }) => {
  await page.addInitScript(`localStorage.removeItem('accessToken')`);
};

export { getAccessToken, loginForTests, setAccessToken, removeAccessToken };
