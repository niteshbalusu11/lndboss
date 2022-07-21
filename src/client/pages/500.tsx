import { StandardHomeButtonLink, StartFlexBox } from '../standard_components/app-components';

import { CssBaseline } from '@mui/material';
import React from 'react';

// Standard 500 error page to be used for all 500 errors

const styles = {
  h1: {
    marginTop: '100px',
  },
};

export default function Custom500() {
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <h1 style={styles.h1}>500 - Server-side error occurred</h1>
      </StartFlexBox>
    </CssBaseline>
  );
}
