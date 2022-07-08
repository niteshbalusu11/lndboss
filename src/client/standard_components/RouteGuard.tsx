import { clientConstants } from '~client/utils/constants';
import { isJwtValid } from '~client/utils/jwt';
import { useEffect } from 'react';
import { useNotify } from '~client/hooks/useNotify';

// Gets called from _app.tsx and checks if user is logged in and redirects to login page if not

const RouteGuard = ({ router, children }: any) => {
  const path = router.pathname;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    authCheck(accessToken);
  }, [path]);

  const authCheck = (accessToken: string) => {
    const { publicPaths } = clientConstants;
    const isPublicPath = publicPaths.includes(path);

    if (!!isPublicPath) {
      return;
    }

    if (!accessToken) {
      useNotify({ type: 'info', message: 'Please login again.' });
      router.push(clientConstants.loginUrl);

      return;
    }

    const isValidToken = isJwtValid({ token: accessToken });

    if (!isValidToken) {
      useNotify({ type: 'info', message: 'Session expired. Please login again.' });
      router.push(clientConstants.loginUrl);
    }
  };

  return children;
};

export default RouteGuard;
