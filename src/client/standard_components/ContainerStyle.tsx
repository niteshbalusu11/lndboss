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
        <StandardButtonLink label="Login" destination="/Login" />
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
