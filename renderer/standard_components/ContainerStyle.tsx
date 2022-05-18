import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import StandardButtonLink from './StandardButtonLink';
import { createUseStyles } from 'react-jss';
import CenterFlexBox from './CenterFlexBox';
import ResponsiveGrid from './ResponsiveGrid';
import commands from '../commands';

const styles = createUseStyles({
  button: {
    fontSize: '15px',
    margin: '0px',
    cursor: 'pointer',
    marginTop: '20px',
    marginLeft: '20px',
    height: '30px',
    fontWeight: 'bold',
    position: 'fixed',
    top: '15px',
    right: '20px',
  },
});

const ContainerStyle = () => {
  const classes = styles();
  return (
    <CssBaseline>
      <CenterFlexBox>
        <StandardButtonLink label="Login" destination="/Login" buttonStyle={classes.button} />
        <ResponsiveGrid gridArray={commands} />
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default ContainerStyle;
