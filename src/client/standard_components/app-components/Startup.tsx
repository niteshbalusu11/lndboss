import React, { useEffect } from 'react';

import { CssBaseline } from '@mui/material';
import Router from 'next/router';
import { clientConstants } from '~client/utils/constants';

/*
  Render bos startup video for 3 seconds and redirect to the commands page.
*/

const styles: any = {
  video: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    minWidth: '100%',
    minHeight: '100%',
  },
};

const Startup = () => {
  useEffect(() => {
    const id = setTimeout(() => {
      Router.push(clientConstants.loginUrl);
    }, 3000);

    return () => clearTimeout(id);
  }, []);
  return (
    <CssBaseline>
      <video autoPlay muted style={styles.video}>
        <source src="/startup.mp4" type="video/mp4" id="startup_video" />
      </video>
    </CssBaseline>
  );
};

export default Startup;
