import { StandardHomeButtonLink, StartFlexBox } from '../standard_components/app-components';

import { CssBaseline } from '@mui/material';
import React from 'react';

// Standard 404 page not found page to be used for all 404 errors

const styles = {
  h1: {
    marginTop: '100px',
  },
};

export default function Custom404() {
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <h1 style={styles.h1}>404 - Page Not Found</h1>
      </StartFlexBox>
    </CssBaseline>
  );
}
