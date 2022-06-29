import axios from 'axios';

const setAccessToken = async ({ page }) => {
  const url = process.env.TESTING_URL!;

  const response = await axios.post(url, {
    headers: { 'Content-Type': 'application/json' },
    password: process.env.TESTING_PASSWORD,
    username: process.env.TESTING_USERNAME,
  });

  const data = await response.data;

  const { accessToken } = data;

  await page.addInitScript(`localStorage.setItem('accessToken', '${accessToken}')`);

  return accessToken;
};

const getAccessToken = async () => {
  const url = 'http://[::1]:8055/api/auth/login';

  const response = await axios.post(url, {
    headers: { 'Content-Type': 'application/json' },
    password: process.env.TESTING_PASSWORD,
    username: process.env.TESTING_USERNAME,
  });

  const data = await response.data;

  const { accessToken } = data;

  return accessToken;
};

const removeAccessToken = async ({ page }) => {
  await page.addInitScript(`localStorage.removeItem('accessToken')`);
};

export { getAccessToken, setAccessToken, removeAccessToken };
