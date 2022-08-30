import { Divider, List, Toolbar, Typography } from '@mui/material';
import { MainListItems, SecondaryListItems } from '../dashboard/listItems';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import React, { useState } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

import AccountingDashboard from './AccountingDashboard';
import Box from '@mui/material/Box';
import CheckConnection from './CheckConnection';
import CssBaseline from '@mui/material/CssBaseline';
import DefaultDashboardContainer from './DefaultDashboardContainer';
import DonateModal from './DonateModal';
import MuiDrawer from '@mui/material/Drawer';
import { SavedNodes } from '~client/standard_components/app-components';

// Renders the main dashboard page

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const mdTheme = createTheme();

const MainDashboard = () => {
  const [accounting, setAccounting] = useState(0);
  const [checkConnection, setCheckConnection] = useState(false);
  const [isMonthToDate, setIsMonthToDate] = useState(false);

  const DisplayContainer = () => {
    if (!checkConnection) {
      return <CheckConnection setCheckConnection={setCheckConnection} />;
    }
    if (accounting === 1) {
      return <AccountingDashboard days={1} />;
    }

    if (accounting === 7) {
      return <AccountingDashboard days={7} />;
    }

    if (accounting === 30) {
      return <AccountingDashboard days={30} />;
    }

    if (accounting === 0) {
      return <DefaultDashboardContainer />;
    }

    if (!!isMonthToDate) {
      return <AccountingDashboard days={accounting} />;
    }

    return <DefaultDashboardContainer />;
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar
            sx={{
              background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
            }}
          >
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              LndBoss Dashboard
            </Typography>
            <SavedNodes />
            <DonateModal />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={true}>
          <Divider />
          <List component="nav">
            <MainListItems setAccounting={setAccounting} />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems setAccounting={setAccounting} setIsMonthToDate={setIsMonthToDate} />
          </List>
        </Drawer>
        <DisplayContainer />
      </Box>
    </ThemeProvider>
  );
};

export default MainDashboard;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
