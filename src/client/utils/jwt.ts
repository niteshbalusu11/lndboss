/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode';

/** Decode the JWT token
  {
    token: <JWT Auth token String>,
  }
  @returns
  {
    boolean: <true if the token is valid, false otherwise>
  }
*/

type Decoded = {
  exp: number;
  iat: number;
  username: string;
  sub: string;
};

export const isJwtValid = ({ token }: { token: string }) => {
  try {
    const decoded: Decoded = jwt_decode(token);

    if (!decoded || !decoded.exp) {
      return false;
    }
    const { exp } = decoded;
    const now = new Date().getTime();

    return now < exp * 1000;
  } catch (error) {
    return false;
  }
};

/** Decode the JWT token
  {
    token: <JWT Auth token String>,
  }
  @returns
    decoded: <Decoded JWT Object>
*/

export const jwtDecode = ({ token }: { token: string }) => {
  try {
    const decoded: Decoded = jwt_decode(token);

    if (!decoded || !decoded.exp) {
      return false;
    }

    return decoded.exp;
  } catch (error) {
    return false;
  }
};
