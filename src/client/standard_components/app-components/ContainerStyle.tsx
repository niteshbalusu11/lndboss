import { PositionedMenu, ResponsiveGrid } from './index';

import CenterFlexBox from './CenterFlexBox';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import commands from '../../commands';

/*
  Renders the login button and the commands grid on the home page.
*/

const ContainerStyle = () => {
  return (
    <CssBaseline>
      <CenterFlexBox>
        <PositionedMenu />
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
