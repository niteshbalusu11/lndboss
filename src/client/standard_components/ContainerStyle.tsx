import CenterFlexBox from './CenterFlexBox';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ResponsiveAppBar from './PositionedMenu';
import ResponsiveGrid from './ResponsiveGrid';
import commands from '../commands';

/*
  Renders the login button and the commands grid on the home page.
*/

const ContainerStyle = () => {
  return (
    <CssBaseline>
      <CenterFlexBox>
        <ResponsiveAppBar />
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
