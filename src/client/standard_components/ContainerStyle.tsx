import CenterFlexBox from './CenterFlexBox';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ResponsiveGrid from './ResponsiveGrid';
import StandardButtonLink from './StandardButtonLink';
import commands from '../commands';

/*
  Renders the login button and the commands grid on the home page.
*/

const ContainerStyle = () => {
  return (
    <CssBaseline>
      <CenterFlexBox>
        <div style={{ width: '50px' }}>
          <StandardButtonLink label="Authenticate" destination="/Authenticate" />
          <StandardButtonLink label="Login" destination="/auth/Login" />
        </div>
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
