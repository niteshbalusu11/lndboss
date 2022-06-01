import React, { useEffect } from 'react';
import Router from 'next/router';
import { CssBaseline } from '@mui/material';

/*
  Render bos startup video for 3 seconds and redirect to the commands page.
*/

const styles: any = {
  video: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'fixed',
    zIndex: '-1',
  },
};

const Startup = () => {
  useEffect(() => {
    const id = setTimeout(() => {
      Router.push('/Commands');
    }, 3000);

    return () => clearTimeout(id);
  }, []);
  return (
    <CssBaseline>
      <video autoPlay loop style={styles.video}>
        <source src="/startup.mov" type="video/mp4" id="startup_video" />
      </video>
    </CssBaseline>
  );
};

export default Startup;
