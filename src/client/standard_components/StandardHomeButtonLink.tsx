import { Button, ButtonProps, styled } from '@mui/material';

import Link from 'next/link';
import React from 'react';
import { clientConstants } from '~client/utils/constants';
import { purple } from '@mui/material/colors';

/* Renders the standard home link button
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

const StandardHomeButtonLink = () => {
  return (
    <Link href={clientConstants.commandsPage}>
      <ColorButton style={styles.button} variant="contained" id={clientConstants.homeButtonLabel}>
        {clientConstants.homeButtonLabel}
      </ColorButton>
    </Link>
  );
};
export default StandardHomeButtonLink;
