import { Button, ButtonProps, styled } from '@mui/material';

import React from 'react';
import { grey } from '@mui/material/colors';

/*
  Renders the standard submit button used in command forms.
*/

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: grey[900],
  '&:hover': {
    backgroundColor: grey[800],
  },
  marginTop: '30px',
  fontWeight: 'bold',
  width: '250px',
}));

const SubmitButton = (props: ButtonProps) => {
  return <ColorButton {...props}>{props.children}</ColorButton>;
};

export default SubmitButton;
