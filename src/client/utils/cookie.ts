import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import { jwtDecode } from './jwt';

const lndbossCookie = 'lndboss-cookie';

const diff = (m: number, n: number) => Math.round(m - n);

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
    secure: process.env.NODE_ENV === 'production',
  };

  setCookie(lndbossCookie, token, cookieOptions);
};

export const getAuthenticatedCookie = () => {
  const cookie = getCookie(lndbossCookie);

  return String(cookie);
};

export const removeAuthenticatedCookie = () => {
  deleteCookie(lndbossCookie);
};
