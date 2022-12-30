import { Button, Menu, MenuItem } from '@mui/material';

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
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
  margin: '10px',
  fontWeight: 'bold',
  color: 'white',
  height: '30px',
  fontSize: '14px',
  marginLeft: '20px',
  marginTop: '15px',
};

const StandardHomeButtonLink = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="home-button"
        aria-controls={open ? 'home-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={styles}
      >
        Home
      </Button>
      <Menu
        id="home-menu"
        aria-labelledby="home-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Link href={clientConstants.dashboardPage}>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Link>
        <Link href={clientConstants.commandsPage}>
          <MenuItem onClick={handleClose}>Commands</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default StandardHomeButtonLink;
