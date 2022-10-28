import nookies, { destroyCookie, parseCookies, setCookie } from 'nookies';

import { jwtDecode } from './jwt';

const lndbossCookie = 'lndboss-cookie';

const diff = (m: number, n: number) => Math.round(m - n);

// Get cookie from browser
export const getAuthenticatedCookie = () => {
  const cookie = parseCookies();

  return cookie[lndbossCookie];
};

export const getAuthenticatedServerCookie = ctx => {
  const cookies = nookies.get(ctx);

  if (!cookies || !cookies[lndbossCookie]) {
    return false;
  }

  return cookies[lndbossCookie];
};

// Remove cookie from browser
export const removeAuthenticatedCookie = () => {
  destroyCookie(null, lndbossCookie);
};

// Set cookie to browser
export const setAuthenticatedCookie = async ({ token }) => {
  const maxAge = jwtDecode({ token });

  if (!maxAge) {
    return false;
  }

  const currentTimeStamp = new Date().getTime() / 1000;

  const cookieOptions = {
    maxAge: diff(maxAge, currentTimeStamp),
    path: '/',
    sameSite: true,
    secure: false,
  };

  setCookie(null, lndbossCookie, token, cookieOptions);
};
