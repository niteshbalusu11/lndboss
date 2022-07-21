import { Button, ButtonProps, styled } from '@mui/material';

import Link from 'next/link';
import React from 'react';
import { purple } from '@mui/material/colors';

/* Renders the standard link button
  {
    destination: <Button Destination String>
    label: <Button Label String>
  }

*/

const styles = {
  button: {
    height: '30px',
    marginLeft: '20px',
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

type Props = {
  label: string;
  destination: string;
  dynamicStyle?: any;
};

const StandardButtonLink = ({ destination, label, dynamicStyle }: Props) => {
  return (
    <Link href={destination}>
      <ColorButton style={dynamicStyle || styles.button} variant="contained" id={label}>
        {label}
      </ColorButton>
    </Link>
  );
};
export default StandardButtonLink;
