import React from 'react';
import { CssBaseline } from '@mui/material';
import StandardButtonLink from '../standard_components/StandardButtonLink';
import StartFlexBox from '../standard_components/StartFlexBox';

const styles = {
  h1: {
    marginTop: '100px',
  },
};

export default function Custom500() {
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
        <h1 style={styles.h1}>500 - Server-side error occurred</h1>
      </StartFlexBox>
    </CssBaseline>
  );
}
