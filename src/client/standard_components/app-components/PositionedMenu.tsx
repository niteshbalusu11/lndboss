import * as React from 'react';

import { Button, Menu, MenuItem } from '@mui/material';

import Link from 'next/link';
import { clientConstants } from '~client/utils/constants';
import { purple } from '@mui/material/colors';
import { useNotify } from '~client/hooks/useNotify';

// Menu button on the commands page

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

const PositionedMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('accessToken');
    useNotify({ type: 'info', message: 'Logged out successfully' });
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
        Menu
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
        <Link href={clientConstants.authenticatePage}>
          <MenuItem onClick={handleClose}>Authenticate</MenuItem>
        </Link>
        <Link href={clientConstants.dashboardPage}>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Link>
        <Link href={clientConstants.loginUrl}>
          <MenuItem onClick={handleClose}>Login</MenuItem>
        </Link>
        <Link href={clientConstants.loginUrl}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default PositionedMenu;
