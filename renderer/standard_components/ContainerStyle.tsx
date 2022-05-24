import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import StandardButtonLink from './StandardButtonLink';
import CenterFlexBox from './CenterFlexBox';
import ResponsiveGrid from './ResponsiveGrid';
import commands from '../commands';

/*
  Renders the login button and the commands grid on the home page.
*/

const ContainerStyle = () => {
  return (
    <CssBaseline>
      <CenterFlexBox>
        <StandardButtonLink label="Login" destination="/Login" />
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
