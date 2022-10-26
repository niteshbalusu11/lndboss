import axios from 'axios';

const lndbossCookie = 'lndboss-cookie';

const setAccessToken = async ({ context }) => {
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

  // await page.addInitScript(`localStorage.setItem('accessToken', '${accessToken}')`);
  // await page.addInitScript(setCookie(lndbossCookie, accessToken));

  // const browserContext = await browser.newContext();

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

const removeAccessToken = async ({ browser, page }) => {
  // await page.addInitScript(`localStorage.removeItem('accessToken')`);
  const browserContext = await browser.newContext();
  await browserContext.clearCookies();
  // await page.addInitScript(deleteCookie(lndbossCookie));
};

export { getAccessToken, setAccessToken, removeAccessToken };
