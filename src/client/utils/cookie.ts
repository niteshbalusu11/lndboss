import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import { jwtDecode } from './jwt';

const lndbossCookie = 'lndboss-cookie';

const diff = (m: number, n: number) => Math.round(m - n);

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

  setCookie(lndbossCookie, token, cookieOptions);
};

// Get cookie from browser
export const getAuthenticatedCookie = () => {
  const cookie = getCookie(lndbossCookie);

  return String(cookie);
};

// Remove cookie from browser
export const removeAuthenticatedCookie = () => {
  deleteCookie(lndbossCookie);
};
